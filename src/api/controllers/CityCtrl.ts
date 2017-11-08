import City from '../../domain/cityLife/model/City';
import CitySample from '../../domain/cityLife/model/CitySample';
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
        this.cityRepository.store(CitySample.MARTIGNAS);
    }

    public city = (req : rest.Request, res : rest.Response, next : rest.Next) => {
        if (!req.params || !req.params.insee) {
            return next(new restifyErrors.BadRequestError('insee must be provided'));
        }
        const askedCity : City = this.cityRepository.findByInsee(req.params.insee);
        res.json(askedCity);
    }
}

export default CityCtrl;
