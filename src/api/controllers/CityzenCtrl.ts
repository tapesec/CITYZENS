import { OK } from 'http-status-codes';
import * as rest from 'restify';

import CityzenId from '../../application/domain/cityzen/CityzenId';
import ProfileCityzen from '../../application/usecases/ProfileCityzen';
import MettreAJourProfileCityzen from '../../application/usecases/MettreAJourProfileCityzen';
import UseCaseStatus from '../../application/usecases/UseCaseStatus';
import { patchCityzenSchema } from '../requestValidation/schema';
import RootCtrl from './RootCtrl';

class CityzenCtrl extends RootCtrl {
    constructor(
        protected profileCityzen: ProfileCityzen,
        protected mettreAJourProfileCityzen: MettreAJourProfileCityzen,
    ) {
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
            const useCaseResult = await this.profileCityzen.run({
                cityzenId,
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(this.responseError.logAndCreateNotFound(req, 'Cityzen not foud'));
            }
            res.json(OK, useCaseResult.cityzen);
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
            const useCaseResult = await this.mettreAJourProfileCityzen.run({
                cityzenId,
                user: req.cityzenIfAuthenticated,
                payload: req.body,
            });
            switch (useCaseResult.status) {
                case UseCaseStatus.NOT_FOUND:
                    return next(this.responseError.logAndCreateNotFound(req, 'Cityzen not foud'));
                case UseCaseStatus.UNAUTHORIZED:
                    return next(
                        this.responseError.logAndCreateUnautorized(
                            req,
                            `You're not granted to update this cityzen`,
                        ),
                    );
                default:
                    res.json(OK, useCaseResult.cityzenUpdated);
            }
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}

export default CityzenCtrl;
