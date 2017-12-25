import City from '../../domain/cityLife/model/city/City';
import CitySample from '../../domain/cityLife/model/sample/CitySample';
import cityRepositoryInMemory, { CityRepositoryInMemory }
from '../../infrastructure/CityRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';
const restifyErrors = require('restify-errors');

class CityCtrl extends RootCtrl {

    private cityRepository : CityRepositoryInMemory;

    public static INSEE_NOT_FOUND = 'invalid insee code';

    constructor(
        errorHandler: ErrorHandler, 
        jwtParser : JwtParser, 
        cityRepositoryInMemory : CityRepositoryInMemory,
    ) {
        super(errorHandler, jwtParser);
        this.cityRepository = cityRepositoryInMemory;
        this.cityRepository.store(CitySample.MARTIGNAS);
    }

    // method=GET url=/citys/{inseeCode}
    public city = (req : rest.Request, res : rest.Response, next : rest.Next) => {
        try {
            const askedCity : City = this.cityRepository.findByInsee(req.params.insee);
            if (askedCity) res.json(200, askedCity);
            else next(new restifyErrors.NotFoundError(CityCtrl.INSEE_NOT_FOUND));
        } catch (err) {
            this.errorHandler.logInternal(err.message, `GET ${req.path()}`, next);
        }
    }
}

export default CityCtrl;
