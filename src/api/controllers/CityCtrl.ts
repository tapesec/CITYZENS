import cityRepositoryInMemory, { CityRepositoryInMemory } 
from '../../infrastructure/CityRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
const restifyErrors = require('restify-errors');

class CityCtrl extends RootCtrl {

    private cityRepository : CityRepositoryInMemory;

    constructor(jwtParser : JwtParser, cityRepositoryInMemory : CityRepositoryInMemory) {
        super(jwtParser);
        this.cityRepository = cityRepositoryInMemory;
    }

    public city(req : rest.Request, res : rest.Response, next : rest.Next) {
        if (!req.params || !req.params.insee) {
            return next(new restifyErrors.BadRequestError('insee must be provided'));
        }
        res.send('it works');
    }
}

export default CityCtrl;
