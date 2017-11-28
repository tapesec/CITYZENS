import cityzenFromJwt from '../services/cityzen/cityzenFromJwt';
import hotspotsByArea from '../services/hotspot/hotspotsByArea';
import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import hotspotsByCodeCommune from '../services/hotspot/hotspotsByCodeCommune';
import hotspotRepositoryInMemory, {
    HotspotRepositoryInMemory,
} from '../../infrastructure/HotspotRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as querystring from 'querystring';
import HotspotSample from '../../domain/cityLife/model/sample/HotspotSample';
import * as rest from 'restify';
import * as helpers from '../helpers/';
const logs = require('./../../logs/');
const httpResponseDataLogger = logs.get('http-response-data');
import { OK, CREATED } from 'http-status-codes';
import * as restifyErrors from 'restify-errors';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import { createHospotSchema } from '../requestValidation/createHotspotValidation';

class HotspotCtrl extends RootCtrl​​ {

    private hotspotRepository : HotspotRepositoryInMemory;
    private hotspotFactory : HotspotFactory;

    constructor (
        jwtParser : JwtParser,
        hotspotRepositoryInMemory : HotspotRepositoryInMemory,
        hotspotFactory : HotspotFactory,
    ) {

        super(jwtParser);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.hotspotFactory = hotspotFactory;
    }

    // method=GET url=/hotspots
    public hotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {

        const queryStrings : any = req.query;
        let badRequestMessage : string;
        let hotspotsResult : Hotspot[];

        if (this.queryByArea(queryStrings)) {
            hotspotsResult = hotspotsByArea(queryStrings, this.hotspotRepository);
        } else if (req.query.insee) {
            hotspotsResult = hotspotsByCodeCommune(req.query.insee, this.hotspotRepository);
        } else {
            badRequestMessage = 'Invalid query strings';
            return next(new restifyErrors.BadRequestError(badRequestMessage));
        }
        res.json(OK, hotspotsResult);
    }

    // method=POST url=/hotspots
    public postHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {

        if (!this.schemaValidator.validate(createHospotSchema, req.body))
            return next(new restifyErrors.BadRequestError(this.schemaValidator.errorsText()));

        try {
            req.body.cityzen = cityzenFromJwt(this.decodedJwtPayload);
            const newHotspot = this.hotspotFactory.createHotspot(req.body);
            this.hotspotRepository.store(newHotspot);
            res.json(CREATED, newHotspot);
        } catch (err) {
            return next(new restifyErrors.InternalServerError(err));
        }
    }

    private queryByArea(queryStrings : any) : boolean {
        if (queryStrings && queryStrings.north && queryStrings.west &&
            queryStrings.south && queryStrings.east
        ) {
            return true;
        }
        return false;
    }
}

export default HotspotCtrl;
