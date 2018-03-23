import * as rest from 'restify';
import RootCtrl from './RootCtrl';
import hotspotsByCodeCommune from '../services/hotspot/hotspotsByCodeCommune';
import hotspotsByArea from '../services/hotspot/hotspotsByArea';
import cityzenFromAuth0 from '../services/cityzen/cityzenFromAuth0';
import * as isAuthorized from './../services/hotspot/isAuthorized';
import actAsSpecified from '../services/hotspot/actAsSpecified';
import HotspotReducer from './../services/hotspot/HotspotReducer';
import ErrorHandler from '../services/errors/ErrorHandler';
import Login from '../services/auth/Login';
import Algolia from './../services/algolia/Algolia';
import AlertHotspot from '../../domain/cityLife/model/hotspot/AlertHotspot';
import EventHotspot from '../../domain/cityLife/model/hotspot/EventHotspot';
import WallHotspot from '../../domain/cityLife/model/hotspot/WallHotspot';
import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import { getHotspots, postMemberSchema } from '../requestValidation/schema';
import createHotspotsSchema from '../requestValidation/createHotspotsSchema';
import patchHotspotsSchema from '../requestValidation/patchHotspotsSchema';
import { strToNumQSProps } from '../helpers/';
import { CREATED, OK, getStatusText } from 'http-status-codes';
import Author from '../../domain/cityLife/model/author/Author';

class HotspotCtrl extends RootCtrl {
    private hotspotRepository: HotspotRepositoryInMemory;
    private algolia: Algolia;
    private hotspotFactory: HotspotFactory;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';
    public static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    public static HOTSPOT_PRIVATE = 'Private hotspot access';
    public static NOT_AUTHOR = 'You must be the author';
    public static ADD_ITSELF = "Tou can't add yourself";
    public static PERTINENCE_ON_NOT_ALERT = "You can't vote on the pertinence of a non-Alert hotspot";

    constructor(
        errorHandler: ErrorHandler,
        loginService: Login,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
        hotspotFactory: HotspotFactory,
        algolia: Algolia,
    ) {
        super(errorHandler, loginService);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.hotspotFactory = hotspotFactory;
        this.algolia = algolia;
        this.algolia.initHotspots();
    }

    // method=GET url=/hotspots
    public hotspots = (req: rest.Request, res: rest.Response, next: rest.Next) => {
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
                hotspotsResult = hotspotsByArea(queryStrings, this.hotspotRepository);
            } else if (queryStrings.insee) {
                hotspotsResult = hotspotsByCodeCommune(queryStrings.insee, this.hotspotRepository);
            }
            const hotspotReducer = new HotspotReducer(hotspotsResult);
            const visibleHotspots = hotspotReducer.renderVisibleHotspotsByVisitorStatus(
                this.cityzenIfAuthenticated,
            );
            res.json(OK, visibleHotspots);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message));
        }
    };

    public getHotspot = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.hotspotRepository.isSet(req.params.id)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `GET ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        try {
            const hotspot = this.hotspotRepository.findById(req.params.id);

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
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message));
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
            this.hotspotRepository.store(newHotspot);
            res.json(CREATED, newHotspot);
            this.algolia
                .addHotspot(newHotspot, this.hotspotRepository)
                .then(v => {
                    this.hotspotRepository.cacheAlgolia(newHotspot, true);
                })
                .catch(r => {
                    this.hotspotRepository.cacheAlgolia(newHotspot, false);
                    this.errorHandler.logSlack(
                        `POST ${req.path()}`,
                        `Algolia fail. \n${JSON.stringify(r)}`,
                    );
                });
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err.message));
        }
    };

    // method= POST url=/hotspots/{hotspotId}/view
    public countView = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST view ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }
        try {
            const visitedHotspot: Hotspot = this.hotspotRepository.findById(req.params.hotspotId);
            visitedHotspot.countOneMoreView();
            this.hotspotRepository.update(visitedHotspot);
            res.json(OK);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST view ${req.path()}`, err.message),
            );
        }
    };

    // method=POST url=/hotspots/{hotspotId}/members
    public addMember = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(postMemberSchema, req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST addMember ${req.path()}`,
                    HotspotCtrl.BAD_REQUEST_MESSAGE,
                ),
            );
        }
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST addMember ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }
        try {
            const hotspot = this.hotspotRepository.findById(req.params.hotspotId);

            if (hotspot instanceof AlertHotspot) {
                return next(
                    this.errorHandler.logAndCreateBadRequest(
                        `POST addMember ${req.path()}`,
                        HotspotCtrl.BAD_REQUEST_MESSAGE,
                    ),
                );
            }
            if (this.cityzenIfAuthenticated.id === req.body.memberId) {
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

            hotspot.addMember(req.body.memberId);
            this.hotspotRepository.update(hotspot);
            res.json(OK, hotspot);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST addMember ${req.path()}`, err.message),
            );
        }
    };

    // method=POST url=/hotspots/{hotspotId}/pertinence
    public postPertinence = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        const hotspot = this.hotspotRepository.findById(req.params.hotspotId);
        if (!(hotspot instanceof AlertHotspot)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST ${req.path()}`,
                    HotspotCtrl.PERTINENCE_ON_NOT_ALERT,
                ),
            );
        }

        const cityzenId = this.cityzenIfAuthenticated.id;
        if (hotspot.voterList.has(cityzenId)) {
            const oldVote = hotspot.voterList.didAgree(cityzenId);
            if (oldVote !== (req.body.agree as boolean)) {
                if (oldVote) hotspot.pertinence.cancelAgree();
                else hotspot.pertinence.cancelDisagree();
            }
            hotspot.voterList.set(cityzenId, req.body.agree as boolean);
        } else {
            hotspot.addVoter(cityzenId, req.body.agree as boolean);
        }
        this.hotspotRepository.update(hotspot);

        res.json(OK, hotspot);
    };

    // method=PATCH url=/hotspots/{hotspotId}
    public patchHotspots = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(patchHotspotsSchema(), req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `PATCH ${req.path()}`,
                    this.schemaValidator.errorsText(),
                ),
            );
        }
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `PATCH ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }
        try {
            const hotspot:
                | WallHotspot
                | EventHotspot
                | AlertHotspot = this.hotspotRepository.findById(req.params.hotspotId);

            if (!isAuthorized.toPatchHotspot(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `PATCH ${req.path()}`,
                        HotspotCtrl.NOT_AUTHOR,
                    ),
                );
            }

            const hotspotToUpdate: Hotspot = actAsSpecified(hotspot, req.body);
            this.hotspotRepository.update(hotspotToUpdate);
            res.json(OK, hotspotToUpdate);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err.message));
        }
    };

    // method=DELETE url=/hotspots/{hotspotId}
    public removeHotspot = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            const hotspot = this.hotspotRepository.findById(req.params.hotspotId);

            if (!isAuthorized.toRemoveHotspot(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `DELETE ${req.path()}`,
                        HotspotCtrl.NOT_AUTHOR,
                    ),
                );
            }

            this.hotspotRepository.remove(req.params.hotspotId);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err.message),
            );
        }
        res.json(OK, getStatusText(OK));
    };
}

export default HotspotCtrl;
