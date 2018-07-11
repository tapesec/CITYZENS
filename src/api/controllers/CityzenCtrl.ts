import * as rest from 'restify';
import CityzenId from '../../domain/cityzens/model/CityzenId';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import Auth0Service from '../services/auth/Auth0Service';
import ErrorHandler from '../services/errors/ErrorHandler';
import RootCtrl from './RootCtrl';

class CityzenCtrl extends RootCtrl {
    constructor(
        errorHandler: ErrorHandler,
        auth0Service: Auth0Service,
        cityzenRepo: CityzenRepositoryPostgreSQL,
    ) {
        super(errorHandler, auth0Service, cityzenRepo);
    }

    // GET /cityzens/{cityzenId}
    public cityzen = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const cityzenId = new CityzenId(req.params.cityzenId);

            const cityzen = await this.cityzenRepository.findById(cityzenId);
            if (cityzen === undefined) {
                return next(this.errorHandler.logAndCreateNotFound(`GET ${req.path()}`));
            }
            res.json(cityzen);
        } catch (err) {
            this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err);
        }
    };
}

export default CityzenCtrl;
