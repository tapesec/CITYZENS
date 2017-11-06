import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import { Response } from '_debugger';
import * as querystring from 'querystring';
import HotspotSample from '../../domain/cityLife/model/HotspotSample';
// tslint:disable-next-line:import-name
import hotspotRepositoryInMemory, {
    HotspotRepositoryInMemory,
} from '../../domain/cityLife/infrastructure/HotspotRepositoryInMemory';
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
        if (this.queryByArea(queryStrings)) {
            if (helpers.latitudeLongitude(queryStrings)) {
                const hotspotsInArea = this.hotspotRepository.findInArea(
                    queryStrings.north,
                    queryStrings.west,
                    queryStrings.south,
                    queryStrings.east,
                );
                httpResponseDataLogger.info('Hotspots retrieved', hotspotsInArea);
                return res.send(JSON.stringify(hotspotsInArea));
            } else {
                badRequestMessage = 'Invalid latitude/longitude format';
            }
        } else {
            badRequestMessage = 'Invalid query strings';
        }
        return next(new restifyErrors.BadRequestError(badRequestMessage));
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
