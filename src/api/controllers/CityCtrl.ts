import City from '../../domain/cityLife/model/city/City';
import CitySample from '../../domain/cityLife/model/sample/CitySample';
import { CityRepositoryInMemory } from '../../infrastructure/CityRepositoryInMemory';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';
import Auth0Info from 'src/api/services/auth/Auth0Info';

class CityCtrl extends RootCtrl {
    private cityRepository: CityRepositoryInMemory;

    public static INSEE_NOT_FOUND = 'invalid insee code';
    public static SLUG_NOT_FOUND = 'invalid slug name';

    constructor(
        errorHandler: ErrorHandler,
        auth0Info: Auth0Info,
        cityRepositoryInMemory: CityRepositoryInMemory,
    ) {
        super(errorHandler, auth0Info);
        this.cityRepository = cityRepositoryInMemory;
        this.cityRepository.store(CitySample.MARTIGNAS);
    }

    // method=GET url=/cities/{slug}
    public city = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const askedCity: City = this.cityRepository.findBySlug(req.params.slug);
            if (askedCity) {
                res.json(200, askedCity);
            } else {
                return next(
                    this.errorHandler.logAndCreateNotFound(
                        `GET ${req.path()}`,
                        CityCtrl.SLUG_NOT_FOUND,
                    ),
                );
            }
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message));
        }
    };
}

export default CityCtrl;
