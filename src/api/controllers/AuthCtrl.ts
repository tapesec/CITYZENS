import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';
import Auth0Service from 'src/api/services/auth/Auth0Service';

class AuthCtrl extends RootCtrl {
    constructor(errorHandler: ErrorHandler, auth0Service: Auth0Service) {
        super(errorHandler, auth0Service);
    }

    public login = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const body: any = await this.auth0Service.login(req.query.username, req.query.password);
            if (body.error) {
                return next(
                    this.errorHandler.logAndCreateInvalidCredentials(
                        `DELETE ${req.path()}`,
                        body.error_description,
                    ),
                );
            }
            res.json(body);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err.message),
            );
        }
    };
}
export default AuthCtrl;
