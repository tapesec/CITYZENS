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
const logs = require('./../../logs/');
const httpResponseDataLogger = logs.get('http-response-data');
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import * as restifyErrors from 'restify-errors';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import { createHospotSchema, getHotspots } from '../requestValidation/schema';
import SlackWebhook from '../libs/SlackWebhook';
import config from '../config/index';
const request = require('request');

class HotspotCtrl extends RootCtrl​​ {

    private hotspotRepository : HotspotRepositoryInMemory;
    private hotspotFactory : HotspotFactory;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';

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
            const hook = new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request);
            hook.alert(`Bad request on GET ${req.getPath()} \n ${JSON.stringify(queryStrings)}`);
            return next(new restifyErrors.BadRequestError(HotspotCtrl.BAD_REQUEST_MESSAGE));
        }
        try {
            if (queryStrings.north) {
                hotspotsResult = hotspotsByArea(queryStrings, this.hotspotRepository);
            } else if (queryStrings.insee) {
                hotspotsResult = hotspotsByCodeCommune(queryStrings.insee, this.hotspotRepository);
            }
        } catch (err) {
            return next(new restifyErrors.InternalServerError(err));
        }
        res.json(OK, hotspotsResult);
    }

    // method=POST url=/hotspots
    public postHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {

        if (!this.schemaValidator.validate(createHospotSchema, req.body))
            return next(new restifyErrors.BadRequestError(this.schemaValidator.errorsText()));

        try {
            req.body.cityzen = cityzenFromJwt(this.decodedJwtPayload);
            const newHotspot: Hotspot = this.hotspotFactory.build(req.body);
            this.hotspotRepository.store(newHotspot);
            res.json(CREATED, newHotspot);
        } catch (err) {
            return next(new restifyErrors.InternalServerError(err));
        }
    }
}

export default HotspotCtrl;
