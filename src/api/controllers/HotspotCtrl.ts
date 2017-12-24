import AlertHotspot from '../../domain/cityLife/model/hotspot/AlertHotspot';
import EventHotspot from '../../domain/cityLife/model/hotspot/EventHotspot';
import WallHotspot from '../../domain/cityLife/model/hotspot/WallHotspot';
import cityzenFromJwt from '../services/cityzen/cityzenFromJwt';
import hotspotsByArea from '../services/hotspot/hotspotsByArea';
import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import hotspotsByCodeCommune from '../services/hotspot/hotspotsByCodeCommune';
import hotspotRepositoryInMemory, {
    HotspotRepositoryInMemory,
} from '../../infrastructure/HotspotRepositoryInMemory';
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

class HotspotCtrl extends RootCtrl​​ {

    private hotspotRepository : HotspotRepositoryInMemory;
    private hotspotFactory : HotspotFactory;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';

    constructor (
        jwtParser : JwtParser,
        hotspotRepositoryInMemory : HotspotRepositoryInMemory,
        hotspotFactory: HotspotFactory,
    ) {
        super(jwtParser);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.hotspotFactory = hotspotFactory;
    }

    // method=GET url=/hotspots
    public hotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {

        const queryStrings: any = strToNumQSProps(req.query, ['north', 'east', 'west', 'south']);
        let hotspotsResult : Hotspot[];

        if (!this.schemaValidator.validate(getHotspots, queryStrings)) {
            // this.hook.alert
            // (`Bad request on GET ${req.path()} \n ${JSON.stringify(queryStrings)}`);
            return next(new restifyErrors.BadRequestError(HotspotCtrl.BAD_REQUEST_MESSAGE));
        }
        try {
            if (queryStrings.north) {
                hotspotsResult = hotspotsByArea(queryStrings, this.hotspotRepository);
            } else if (queryStrings.insee) {
                hotspotsResult = hotspotsByCodeCommune(queryStrings.insee, this.hotspotRepository);
            }
        } catch (err) {
            return this.nextInternalError(next, err.message, `GET ${req.path()}`);
        }
        res.json(OK, hotspotsResult);
    }

    // method=POST url=/hotspots
    public postHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.schemaValidator.validate(createHotspotsSchema(), req.body))
            return next(new restifyErrors.BadRequestError(this.schemaValidator.errorsText()));

        try {
            req.body.cityzen = cityzenFromJwt(this.decodedJwtPayload);
            const newHotspot: Hotspot = this.hotspotFactory.build(req.body);
            this.hotspotRepository.store(newHotspot);
            res.json(CREATED, newHotspot);
        } catch (err) {
            return this.nextInternalError(next, err.message, `POST ${req.path()}`);
        }
    }

    // method= POST url=/hotspots/{hotspotId}/view
    public countView = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(new restifyErrors.NotFoundError(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            const visitedHotspot: Hotspot = this.hotspotRepository.findById(req.params.hotspotId);
            visitedHotspot.countOneMoreView();
            this.hotspotRepository.update(visitedHotspot);
            res.json(OK);
        } catch (err) {
            return this.nextInternalError(next, err.message, `POST view ${req.path()}`);
        }
    }

    // method=PATCH url=/hotspots/{hotspotId}
    public patchHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.schemaValidator.validate(patchHotspotsSchema(), req.body))
            return next(new restifyErrors.BadRequestError(this.schemaValidator.errorsText()));
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(new restifyErrors.NotFoundError(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            const hotspot: WallHotspot|EventHotspot|AlertHotspot =
            this.hotspotRepository.findById(req.params.hotspotId);
            const hotspotToUpdate: Hotspot = actAsSpecified(hotspot, req.body);
            this.hotspotRepository.update(hotspotToUpdate);
            res.json(OK, hotspotToUpdate);
        } catch (err) {
            return this.nextInternalError(next, err.message, `PATCH ${req.path()}`);
        }
    }

    // method=DELETE url=/hotspots/{hotspotId}
    public removeHotspot = (req: rest.Request, res: rest.Response, next: rest.Next) => {

        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(new restifyErrors.NotFoundError(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            this.hotspotRepository.remove(req.params.hotspotId);
        } catch (err) {
            return this.nextInternalError(next, err.message, `DELETE ${req.path()}`);
        }
        res.json(OK, getStatusText(OK));
    }
}

export default HotspotCtrl;
