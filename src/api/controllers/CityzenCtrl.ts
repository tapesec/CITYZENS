import * as rest from 'restify';
import { OK } from 'http-status-codes';
import CityzenId from '../../application/domain/cityzen/CityzenId';
import RootCtrl from './RootCtrl';
import { patchCityzenSchema } from '../requestValidation/schema';
import isAuthorized from '../../application/domain/cityzen/CityzenAuthorization';
import updateCityzen from '../../application/domain/cityzen/updateCityzen';
import ICityzenRepository from '../../application/domain/cityzen/ICityzenRepository';

class CityzenCtrl extends RootCtrl {
    constructor(private cityzenRepo: ICityzenRepository) {
        super();
    }

    // GET /cityzens/{cityzenId}
    public cityzen = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!req.query.provider) {
                return next(
                    this.responseError.logAndCreateBadRequest(req, 'provider query is required'),
                );
            }
            const userId = `${req.query.provider}|${req.params.cityzenId}`;
            const cityzenId = new CityzenId(userId);

            const cityzen = await this.cityzenRepo.findById(cityzenId);
            if (cityzen === undefined) {
                return next(this.responseError.logAndCreateNotFound(req, 'Cityzen not foud'));
            }
            res.json(cityzen);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // PATCH /cityzens/{cityzenId}
    public patchCityzen = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(patchCityzenSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        `Invalid message payload: ${this.schemaValidator.errorsText()}`,
                    ),
                );
            }
            const userId = `${req.query.provider}|${req.params.cityzenId}`;
            const cityzenId = new CityzenId(userId);
            if (isAuthorized.toUpdateCityzen(req.cityzenIfAuthenticated, cityzenId)) {
                const cityzenToUpdate = await this.cityzenRepo.findById(cityzenId);
                const cityzenUpdated = updateCityzen(cityzenToUpdate, req.body);
                await this.cityzenRepo.updateCityzen(cityzenUpdated);
                res.status(OK);
                res.json(cityzenUpdated);
            } else {
                return next(
                    this.responseError.logAndCreateUnautorized(
                        req,
                        `You're not granted to update this cityzen`,
                    ),
                );
            }
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}

export default CityzenCtrl;
