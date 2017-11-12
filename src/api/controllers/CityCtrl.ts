import City from '../../domain/cityLife/model/city/City';
import CitySample from '../../domain/cityLife/model/sample/CitySample';
import cityRepositoryInMemory, { CityRepositoryInMemory }
from '../../infrastructure/CityRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
const restifyErrors = require('restify-errors');

class CityCtrl extends RootCtrl {

    private cityRepository : CityRepositoryInMemory;

    public static INSEE_NOT_FOUND = 'invalid insee code';

    constructor(jwtParser : JwtParser, cityRepositoryInMemory : CityRepositoryInMemory) {
        super(jwtParser);
        this.cityRepository = cityRepositoryInMemory;
        this.cityRepository.store(CitySample.MARTIGNAS);
    }

    public city = (req : rest.Request, res : rest.Response, next : rest.Next) => { 
        const askedCity : City = this.cityRepository.findByInsee(req.params.insee);
        if (askedCity) res.json(200, askedCity);
        else next(new restifyErrors.NotFoundError(CityCtrl.INSEE_NOT_FOUND));
    }
}

export default CityCtrl;
