import City from '../../domain/cityLife/model/city/City';
import CitySample from '../../domain/cityLife/model/sample/CitySample';
import cityRepositoryInMemory, { CityRepositoryInMemory }
from '../../infrastructure/CityRepositoryInMemory';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';
const restifyErrors = require('restify-errors');

class CityCtrl extends RootCtrl {

    private cityRepository : CityRepositoryInMemory;

    public static INSEE_NOT_FOUND = 'invalid insee code';

    constructor(
        errorHandler: ErrorHandler, 
        request: any,
        cityRepositoryInMemory : CityRepositoryInMemory,
    ) {
        super(errorHandler, request);
        this.cityRepository = cityRepositoryInMemory;
        this.cityRepository.store(CitySample.MARTIGNAS);
    }

    // method=GET url=/citys/{inseeCode}
    public city = (req : rest.Request, res : rest.Response, next : rest.Next) => {
        try {
            const askedCity : City = this.cityRepository.findByInsee(req.params.insee);
            if (askedCity) {
                res.json(200, askedCity);
            } else {
                return next(this.errorHandler.logAndCreateNotFound(
                    `GET ${req.path()}`, CityCtrl.INSEE_NOT_FOUND,
                ));
            }
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message),
            );
        }
    }
}

export default CityCtrl;
