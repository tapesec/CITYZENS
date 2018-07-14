import { CREATED, getStatusText, OK } from 'http-status-codes';
import * as rest from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import CityId from '../../domain/cityLife/model/city/CityId';
import AlertHotspot from '../../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import HotspotId from '../../domain/cityLife/model/hotspot/HotspotId';
import MediaHotspot from '../../domain/cityLife/model/hotspot/MediaHotspot';
import CityzenId from '../../domain/cityzens/model/CityzenId';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryPostgreSQL';
import { isUuid, strToNumQSProps } from '../helpers/';
import createHotspotsSchema from '../requestValidation/createHotspotsSchema';
import patchHotspotsSchema from '../requestValidation/patchHotspotsSchema';
import { getHotspots, postMemberSchema, postPertinenceSchema } from '../requestValidation/schema';
import ErrorHandler from '../services/errors/ErrorHandler';
import actAsSpecified from '../services/hotspot/actAsSpecified';
import hotspotsByArea from '../services/hotspot/hotspotsByArea';
import hotspotsByCodeCommune from '../services/hotspot/hotspotsByCodeCommune';
import SlideshowService from '../services/widgets/SlideshowService';
import Algolia from './../services/algolia/Algolia';
import HotspotReducer from './../services/hotspot/HotspotReducer';
import * as isAuthorized from './../services/hotspot/isAuthorized';
import RootCtrl from './RootCtrl';

class HotspotCtrl extends RootCtrl {
    private hotspotRepository: HotspotRepositoryInMemory;
    private algolia: Algolia;
    private hotspotFactory: HotspotFactory;
    private slideshowService: SlideshowService;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';
    public static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    public static HOTSPOT_PRIVATE = 'Private hotspot access';
    public static NOT_AUTHOR = 'You must be the author';
    public static ADD_ITSELF = "Tou can't add yourself";
    public static PERTINENCE_ON_NOT_ALERT = "You can't vote on the pertinence of a non-Alert hotspot";
    public static PERTINENCE_DOUBLE_VOTE = "You can't vote twice on the same Alert Hotspot";

    constructor(
        errorHandler: ErrorHandler,
        auth0Service: Auth0Service,
        cityzenRepository: CityzenRepositoryPostgreSQL,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
        hotspotFactory: HotspotFactory,
        algolia: Algolia,
        slideshowService: SlideshowService,
    ) {
        super(errorHandler, auth0Service, cityzenRepository);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.hotspotFactory = hotspotFactory;
        this.algolia = algolia;
        this.algolia.initHotspots();
        this.slideshowService = slideshowService;
    }

    // method=GET url=/hotspots
    public hotspots = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const queryStrings: any = strToNumQSProps(req.query, ['north', 'east', 'west', 'south']);
        let hotspotsResult: Hotspot[];

        if (!this.schemaValidator.validate(getHotspots, queryStrings)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `GET ${req.path()}`,
                    HotspotCtrl.BAD_REQUEST_MESSAGE,
                ),
            );
        }
        try {
            if (queryStrings.north) {
                hotspotsResult = await hotspotsByArea(queryStrings, this.hotspotRepository);
            } else if (queryStrings.insee) {
                hotspotsResult = await hotspotsByCodeCommune(
                    new CityId(queryStrings.insee),
                    this.hotspotRepository,
                );
            }
            const hotspotReducer = new HotspotReducer(hotspotsResult);
            const visibleHotspots = hotspotReducer.renderVisibleHotspotsByVisitorStatus(
                this.cityzenIfAuthenticated,
            );
            res.json(OK, visibleHotspots);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId or id(slug)}
    public getHotspot = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const hotspotId = isUuid(req.params.hotspotId)
            ? new HotspotId(req.params.hotspotId)
            : (req.params.hotspotId as String);

        const isSet = await (hotspotId instanceof HotspotId
            ? this.hotspotRepository.isSet(hotspotId)
            : this.hotspotRepository.isSetBySlug(hotspotId));

        if (!isSet) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `GET ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        try {
            const hotspot = await (hotspotId instanceof HotspotId
                ? this.hotspotRepository.findById(hotspotId)
                : this.hotspotRepository.findBySlug(hotspotId));
            if (isAuthorized.toSeeHotspot(hotspot, this.cityzenIfAuthenticated)) {
                res.json(OK, hotspot);
            } else {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `GET ${req.path()}`,
                        HotspotCtrl.HOTSPOT_PRIVATE,
                    ),
                );
            }
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err));
        }
    };

    // method=POST url=/hotspots
    public postHotspots = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(createHotspotsSchema(), req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST ${req.path()}`,
                    this.schemaValidator.errorsText(),
                ),
            );
        }

        try {
            req.body.cityzen = this.cityzenIfAuthenticated;
            const newHotspot: Hotspot = this.hotspotFactory.build(req.body);
            await this.hotspotRepository.store(newHotspot);
            res.json(CREATED, newHotspot);
            this.algolia
                .addHotspot(newHotspot)
                .then(() => {
                    this.hotspotRepository.cacheAlgolia(newHotspot.id, true);
                })
                .catch(error => {
                    this.hotspotRepository.cacheAlgolia(newHotspot.id, false);
                    this.errorHandler.logSlack(
                        `POST ${req.path()}`,
                        `Algolia fail. \n${JSON.stringify(error)}`,
                    );
                });
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err));
        }
    };

    // method= POST url=/hotspots/{hotspotId}/view
    public countView = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const hotspotId = new HotspotId(req.params.id);
        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST view ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }
        try {
            const visitedHotspot = await this.hotspotRepository.findById(hotspotId);
            visitedHotspot.countOneMoreView();
            await this.hotspotRepository.update(visitedHotspot);
            res.json(OK);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST view ${req.path()}`, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/members
    public addMember = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(postMemberSchema, req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST addMember ${req.path()}`,
                    HotspotCtrl.BAD_REQUEST_MESSAGE,
                ),
            );
        }

        const hotspotId = new HotspotId(req.params.hotspotId);
        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST addMember ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }
        try {
            const memberId = new CityzenId(req.body.memberId);
            const hotspot = await this.hotspotRepository.findById(hotspotId);

            if (hotspot instanceof AlertHotspot) {
                return next(
                    this.errorHandler.logAndCreateBadRequest(
                        `POST addMember ${req.path()}`,
                        HotspotCtrl.BAD_REQUEST_MESSAGE,
                    ),
                );
            }
            if (this.cityzenIfAuthenticated.id === memberId) {
                return next(
                    this.errorHandler.logAndCreateBadRequest(
                        `POST addMember ${req.path()}`,
                        HotspotCtrl.ADD_ITSELF,
                    ),
                );
            }

            if (!isAuthorized.toAddMember(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `POST addMember ${req.path()}`,
                        HotspotCtrl.NOT_AUTHOR,
                    ),
                );
            }

            hotspot.addMember(memberId);
            await this.hotspotRepository.update(hotspot);
            res.json(OK, hotspot);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST addMember ${req.path()}`, err),
            );
        }
    };

    // method=POST url=/hotspots/{hotspotId}/pertinence
    public postPertinence = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(postPertinenceSchema, req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST postPertinence ${req.path()}`,
                    HotspotCtrl.BAD_REQUEST_MESSAGE,
                ),
            );
        }

        const hotspotId = new HotspotId(req.params.hotspotId);

        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);
            if (!(hotspot instanceof AlertHotspot)) {
                return next(
                    this.errorHandler.logAndCreateBadRequest(
                        `POST ${req.path()}`,
                        HotspotCtrl.PERTINENCE_ON_NOT_ALERT,
                    ),
                );
            }

            const cityzenId: CityzenId = this.cityzenIfAuthenticated.id;
            if (hotspot.voterList.has(cityzenId)) {
                return next(
                    this.errorHandler.logAndCreateBadRequest(
                        `POST ${req.path()}`,
                        HotspotCtrl.PERTINENCE_DOUBLE_VOTE,
                    ),
                );
            }

            hotspot.addVoter(cityzenId, req.body.agree as boolean);
            await this.hotspotRepository.update(hotspot);

            res.json(OK, hotspot);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err));
        }
    };

    // method=PATCH url=/hotspots/{hotspotId}
    public patchHotspots = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(patchHotspotsSchema(), req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `PATCH ${req.path()}`,
                    this.schemaValidator.errorsText(),
                ),
            );
        }

        const hotspotId = new HotspotId(req.params.hotspotId);

        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `PATCH ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }
        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);

            if (!isAuthorized.toPatchHotspot(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `PATCH ${req.path()}`,
                        HotspotCtrl.NOT_AUTHOR,
                    ),
                );
            }
            if (req.body.slideShow) {
                await this.slideshowService.removeImage(
                    (<MediaHotspot>hotspot).slideShow.toJSON(),
                    req.body.slideShow,
                );
            }
            const hotspotToUpdate: Hotspot = actAsSpecified(hotspot, req.body);
            await this.hotspotRepository.update(hotspotToUpdate);
            res.json(OK, hotspotToUpdate);
            this.algolia
                .addHotspot(hotspotToUpdate)
                .then(() => {
                    this.hotspotRepository.cacheAlgolia(hotspotToUpdate.id, true);
                })
                .catch(error => {
                    this.hotspotRepository.cacheAlgolia(hotspotToUpdate.id, false);
                    this.errorHandler.logSlack(
                        `PATCH ${req.path()}`,
                        `Algolia fail. \n${JSON.stringify(error)}`,
                    );
                });
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err));
        }
    };

    // method=DELETE url=/hotspots/{hotspotId}
    public removeHotspot = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const hotspotId = new HotspotId(req.params.hotspotId);

        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);

            if (!isAuthorized.toRemoveHotspot(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `DELETE ${req.path()}`,
                        HotspotCtrl.NOT_AUTHOR,
                    ),
                );
            }

            await this.hotspotRepository.remove(hotspotId);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err));
        }
        res.json(OK, getStatusText(OK));
    };
}

export default HotspotCtrl;
