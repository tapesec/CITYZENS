import AlertHotspot from '../../domain/cityLife/model/hotspot/AlertHotspot';
import EventHotspot from '../../domain/cityLife/model/hotspot/EventHotspot';
import WallHotspot from '../../domain/cityLife/model/hotspot/WallHotspot';
import cityzenFromAuth0 from '../services/cityzen/cityzenFromAuth0';
import hotspotsByArea from '../services/hotspot/hotspotsByArea';
import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import hotspotsByCodeCommune from '../services/hotspot/hotspotsByCodeCommune';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import { strToNumQSProps } from '../helpers/';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR ,getStatusText } from 'http-status-codes';
import * as restifyErrors from 'restify-errors';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import { getHotspots } from '../requestValidation/schema';
import createHotspotsSchema from '../requestValidation/createHotspotsSchema';
import patchHotspotsSchema from '../requestValidation/patchHotspotsSchema';
import config from '../config/index';
import actAsSpecified from '../services/hotspot/actAsSpecified';
import ErrorHandler from '../services/errors/ErrorHandler';
import Login from '../services/auth/Login';
import Algolia from './../services/algolia/Algolia';

class HotspotCtrl extends RootCtrl​​ {

    private hotspotRepository : HotspotRepositoryInMemory;
    private algolia: Algolia;
    private hotspotFactory : HotspotFactory;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';

    constructor (
        errorHandler: ErrorHandler,
        loginService : Login,
        hotspotRepositoryInMemory : HotspotRepositoryInMemory,
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
    public hotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {

        const queryStrings: any = strToNumQSProps(req.query, ['north', 'east', 'west', 'south']);
        let hotspotsResult : Hotspot[];

        if (!this.schemaValidator.validate(getHotspots, queryStrings)) {
            return next(this.errorHandler.logAndCreateBadRequest(
                `GET ${req.path()}`, HotspotCtrl.BAD_REQUEST_MESSAGE,
            ));
        }
        try {
            if (queryStrings.north) {
                hotspotsResult = hotspotsByArea(queryStrings, this.hotspotRepository);
            } else if (queryStrings.insee) {
                hotspotsResult = hotspotsByCodeCommune(queryStrings.insee, this.hotspotRepository);
            }
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message),
            );
        }
        res.json(OK, hotspotsResult);
    }

    // method=POST url=/hotspots
    public postHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.schemaValidator.validate(createHotspotsSchema(), req.body)) {
            return next(this.errorHandler.logAndCreateBadRequest(
                `POST ${req.path()}`, this.schemaValidator.errorsText(),
            ));
        }

        try {
            req.body.cityzen = cityzenFromAuth0(this.userInfo);   
            const newHotspot: Hotspot = this.hotspotFactory.build(req.body);
            this.hotspotRepository.store(newHotspot);
            try {
                this.algolia.addHotspot(newHotspot, this.hotspotRepository)
                    .then((v) => {
                        this.hotspotRepository.cacheAlgolia(newHotspot, true);
                    })
                    .catch((v) => {
                        this.hotspotRepository.cacheAlgolia(newHotspot, false);
                    });
            } catch (error) {
                this.errorHandler.logAndCreateInternal(
                    `POST ${req.path()} Algolia fail.`, 
                    error.message,
                );    
            }

            res.json(CREATED, newHotspot);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err.message),
            );
        }
    }

    // method= POST url=/hotspots/{hotspotId}/view
    public countView = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(
                `POST view ${req.path()}`, HotspotCtrl.HOTSPOT_NOT_FOUND,
            ));
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
    }

    // method=PATCH url=/hotspots/{hotspotId}
    public patchHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.schemaValidator.validate(patchHotspotsSchema(), req.body))
            return next(this.errorHandler.logAndCreateBadRequest(
                `PATCH ${req.path()}`, this.schemaValidator.errorsText(),
            ));
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(
                `PATCH ${req.path()}`, HotspotCtrl.HOTSPOT_NOT_FOUND,
            ));
        }
        try {
            const hotspot: WallHotspot|EventHotspot|AlertHotspot =
            this.hotspotRepository.findById(req.params.hotspotId);
            const hotspotToUpdate: Hotspot = actAsSpecified(hotspot, req.body);
            this.hotspotRepository.update(hotspotToUpdate);
            res.json(OK, hotspotToUpdate);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err.message),
            );
        }
    }

    // method=DELETE url=/hotspots/{hotspotId}
    public removeHotspot = (req: rest.Request, res: rest.Response, next: rest.Next) => {

        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            this.hotspotRepository.remove(req.params.hotspotId);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err.message),
            );
        }
        res.json(OK, getStatusText(OK));
    }
}

export default HotspotCtrl;
