import * as rest from 'restify';
import { OK } from 'http-status-codes';
import CityzenId from '../../domain/model/CityzenId';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import Auth0Service from '../services/auth/Auth0Service';
import ErrorHandler from '../services/errors/ErrorHandler';
import RootCtrl from './RootCtrl';
import { patchCityzenSchema } from '../requestValidation/schema';
import isAuthorized from '../../domain/services/CityzenAuthorization';
import updateCityzen from '../services/cityzen/updateCityzen';

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
            if (!req.query.provider) {
                return next(this.errorHandler.logAndCreateBadRequest(`GET ${req.path()}`));
            }
            const userId = `${req.query.provider}|${req.params.cityzenId}`;
            const cityzenId = new CityzenId(userId);

            const cityzen = await this.cityzenRepository.findById(cityzenId);
            if (cityzen === undefined) {
                return next(this.errorHandler.logAndCreateNotFound(`GET ${req.path()}`));
            }
            res.json(cityzen);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err));
        }
    };

    // PATCH /cityzens/{cityzenId}
    public patchCityzen = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(patchCityzenSchema, req.body)) {
                return next(
                    this.errorHandler.logAndCreateBadRequest(
                        `PATCH ${req.path()}`,
                        `Invalid message payload: ${this.schemaValidator.errorsText()}`,
                    ),
                );
            }
            const userId = `${req.query.provider}|${req.params.cityzenId}`;
            const cityzenId = new CityzenId(userId);
            if (isAuthorized.toUpdateCityzen(this.cityzenIfAuthenticated, cityzenId)) {
                const cityzenToUpdate = await this.cityzenRepository.findById(cityzenId);
                const cityzenUpdated = updateCityzen(cityzenToUpdate, req.body);
                await this.cityzenRepository.updateCityzen(cityzenUpdated);
                res.status(OK);
                res.json(cityzenUpdated);
            } else {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `PATCH ${req.path()}`,
                        `You're not granted to update this cityzen`,
                    ),
                );
            }
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err));
        }
    };
}

export default CityzenCtrl;
