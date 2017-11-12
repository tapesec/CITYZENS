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
const restifyErrors = require('restify-errors');

class HotspotCtrl extends RootCtrl​​ {

    private hotspotRepository : HotspotRepositoryInMemory;

    constructor (jwtParser : JwtParser, hotspotRepositoryInMemory : HotspotRepositoryInMemory) {
        super(jwtParser);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.hotspotRepository.store(HotspotSample.TOWNHALL);
        this.hotspotRepository.store(HotspotSample.CHURCH);
        this.hotspotRepository.store(HotspotSample.SCHOOL);
    }

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
        res.json(200, hotspotsResult);
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
