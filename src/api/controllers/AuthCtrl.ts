import * as rest from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import RootCtrl from './RootCtrl';

class AuthCtrl extends RootCtrl {
    constructor(auth0Service: Auth0Service, cityzenRepository: CityzenRepositoryPostgreSQL) {
        super(auth0Service, cityzenRepository);
    }

    public login = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            let body: any;
            try {
                body = await this.auth0Service.login(req.query.username, req.query.password);
            } catch (error) {
                return next(this.responseError.logAndCreateInvalidCredentials(req, error.message));
            }
            if (body.error) {
                return next(
                    this.responseError.logAndCreateInvalidCredentials(req, body.error_description),
                );
            }
            res.json(body);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}
export default AuthCtrl;
