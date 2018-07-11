import * as rest from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import RootCtrl from './RootCtrl';

class AuthCtrl extends RootCtrl {
    constructor(
        errorHandler: ErrorHandler,
        auth0Service: Auth0Service,
        cityzenRepository: CityzenRepositoryPostgreSQL,
    ) {
        super(errorHandler, auth0Service, cityzenRepository);
    }

    public login = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            let body: any;
            try {
                body = await this.auth0Service.login(req.query.username, req.query.password);
            } catch (error) {
                return next(
                    this.errorHandler.logAndCreateInvalidCredentials(
                        `GET ${req.path()}`,
                        error.message,
                    ),
                );
            }
            if (body.error) {
                return next(
                    this.errorHandler.logAndCreateInvalidCredentials(
                        `GET ${req.path()}`,
                        body.error_description,
                    ),
                );
            }
            res.json(body);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err));
        }
    };
}
export default AuthCtrl;
