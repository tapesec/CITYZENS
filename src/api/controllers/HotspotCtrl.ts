import { CREATED, getStatusText, OK } from 'http-status-codes';
import * as rest from 'restify';
import { MCDVLoggerEvent } from '../libs/MCDVLogger';
import CityId from '../../application/domain/city/CityId';
import Hotspot from '../../application/domain/hotspot/Hotspot';
import HotspotId from '../../application/domain/hotspot/HotspotId';
import MediaHotspot from '../../application/domain/hotspot/MediaHotspot';
import { strToNumQSProps } from '../helpers/';
import createHotspotsSchema from '../requestValidation/createHotspotsSchema';
import patchHotspotsSchema from '../requestValidation/patchHotspotsSchema';
import { getHotspots, postPertinenceSchema } from '../requestValidation/schema';
import actAsSpecified from '../../application/domain/hotspot/actAsSpecified';
import SlideshowService from '../services/widgets/SlideshowService';
import Algolia from './../services/algolia/Algolia';
import * as isAuthorized from '../../application/domain/hotspot/services/isAuthorized';
import RootCtrl from './RootCtrl';
import UseCaseStatus from '../../application/usecases/UseCaseStatus';
import Carte from '../../application/domain/hotspot/Carte';
import { IHotspotParSlugOuId } from '../../application/usecases/HotspotParSlugOuId';
import { IHotspotsParZone } from '../../application/usecases/HotspotsParZone';
import { IHotspotsParCodeInsee } from '../../application/usecases/HotspotsParCodeInsee';
import { INouveauHotspot } from '../../application/usecases/NouveauHotspot';
import { ComptabiliseUneVue } from '../../application/usecases/ComptabiliseUneVue';
import { ConfirmeExistence } from '../../application/usecases/ConfirmeExistence';

class HotspotCtrl extends RootCtrl {
    private slideshowService: SlideshowService;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';
    public static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    public static HOTSPOT_PRIVATE = 'Private hotspot access';
    public static NOT_AUTHOR = 'You must be the author';
    public static ADD_ITSELF = "Tou can't add yourself";
    public static PERTINENCE_ON_NOT_ALERT = "You can't vote on the pertinence of a non-Alert hotspot";
    public static PERTINENCE_DOUBLE_VOTE = "You can't vote twice on the same Alert Hotspot";

    constructor(
        private hotspotRepository: Carte,
        private algolia: Algolia,
        slideshowService: SlideshowService,
        private hotspotsParZone: IHotspotsParZone,
        private hotspotsParCodeInsee: IHotspotsParCodeInsee,
        private hotpotsParSlugOuId: IHotspotParSlugOuId,
        private nouveauHotspot: INouveauHotspot,
        private nouvelleVue: ComptabiliseUneVue,
        private confirmeExistence: ConfirmeExistence,
    ) {
        super();
        this.algolia.initHotspots();
        this.slideshowService = slideshowService;
    }

    // method=GET url=/hotspots
    public hotspots = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const queryStrings: any = strToNumQSProps(req.query, ['north', 'east', 'west', 'south']);
        let hotspotsResult: Hotspot[];
        if (!this.schemaValidator.validate(getHotspots, queryStrings)) {
            return next(
                this.responseError.logAndCreateBadRequest(req, HotspotCtrl.BAD_REQUEST_MESSAGE),
            );
        }
        try {
            if (queryStrings.north) {
                hotspotsResult = await this.hotspotsParZone.run({
                    ...queryStrings,
                    user: req.cityzenIfAuthenticated,
                });
                this.logger.info(MCDVLoggerEvent.HOTSPOT_BY_AREA_RETRIEVED, `Hotspots retrieved`);
            } else if (queryStrings.insee) {
                hotspotsResult = await this.hotspotsParCodeInsee.run({
                    cityId: new CityId(queryStrings.insee),
                    user: req.cityzenIfAuthenticated,
                });
            }
            res.json(OK, hotspotsResult);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId or id(slug)}
    public getHotspot = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const useCaseResult = await this.hotpotsParSlugOuId.run({
                user: req.cityzenIfAuthenticated,
                hotspotId: req.params.hotspotId as string,
            });

            if (useCaseResult.status === UseCaseStatus.OK) {
                res.json(OK, useCaseResult.hotspot);
            }

            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, HotspotCtrl.HOTSPOT_PRIVATE),
                );
            }
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=POST url=/hotspots
    public postHotspots = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(createHotspotsSchema(), req.body)) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        this.schemaValidator.errorsText(),
                    ),
                );
            }
            const useCaseResult = await this.nouveauHotspot.run({
                user: req.cityzenIfAuthenticated,
                payload: req.body,
            });
            this.logger.info(MCDVLoggerEvent.HOTSPOT_CREATED, 'nouveau hotspot crée', {
                userId: req.cityzenIfAuthenticated
                    ? req.cityzenIfAuthenticated.id.toString()
                    : 'unknow',
                hotspotType: useCaseResult.nouveauHotspot.type,
                cityId: useCaseResult.nouveauHotspot.cityId.toString(),
            });
            res.json(CREATED, useCaseResult.nouveauHotspot);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method= POST url=/hotspots/{hotspotId}/view
    public countView = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const useCaseResult = await this.nouvelleVue.run(req.params.hotspotId);
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            this.logger.info(MCDVLoggerEvent.NEW_VIEW, 'nouvelle vue', {
                userId: req.cityzenIfAuthenticated
                    ? req.cityzenIfAuthenticated.id.toString()
                    : 'unknow',
                hotspotType: useCaseResult.hotspot.type,
                hotspotId: useCaseResult.hotspot.id.toString(),
                cityId: useCaseResult.hotspot.cityId,
            });
            res.json(OK);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/pertinence
    public postPertinence = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(postPertinenceSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateBadRequest(req, HotspotCtrl.BAD_REQUEST_MESSAGE),
                );
            }
            const hotspotId = new HotspotId(req.params.hotspotId);
            const useCaseResult = await this.confirmeExistence.run({
                hotspotId,
                user: req.cityzenIfAuthenticated,
                confirme: req.body.agree as boolean,
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        HotspotCtrl.PERTINENCE_ON_NOT_ALERT,
                    ),
                );
            }
            if (useCaseResult.status === UseCaseStatus.ALREADY_VOTED) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        HotspotCtrl.PERTINENCE_DOUBLE_VOTE,
                    ),
                );
            }
            res.json(OK, useCaseResult.hotspot);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=PATCH url=/hotspots/{hotspotId}
    public patchHotspots = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(patchHotspotsSchema(), req.body)) {
            return next(
                this.responseError.logAndCreateBadRequest(req, this.schemaValidator.errorsText()),
            );
        }

        const hotspotId = new HotspotId(req.params.hotspotId);

        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(
                this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
            );
        }
        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);

            if (!isAuthorized.toPatchHotspot(hotspot, req.cityzenIfAuthenticated)) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, HotspotCtrl.NOT_AUTHOR),
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
                    this.responseError.logSlack(
                        `PATCH ${req.path()}`,
                        `Algolia fail. \n${JSON.stringify(error)}`,
                    );
                });
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=DELETE url=/hotspots/{hotspotId}
    public removeHotspot = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const hotspotId = new HotspotId(req.params.hotspotId);
        if (!await this.hotspotRepository.isSet(hotspotId)) {
            return next(
                this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
            );
        }
        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);

            if (!isAuthorized.toRemoveHotspot(hotspot, req.cityzenIfAuthenticated)) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, HotspotCtrl.NOT_AUTHOR),
                );
            }
            await this.hotspotRepository.remove(hotspotId);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
        res.json(OK, getStatusText(OK));
    };
}
export default HotspotCtrl;
