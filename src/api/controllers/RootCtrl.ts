import * as r from 'restify';
import * as ajv from 'ajv';
import ErrorHandler from '../services/errors/ErrorHandler';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
import Login from '../services/auth/Login';

class RootCtrl {

    protected schemaValidator : ajv.Ajv = new ajv();
    protected errorHandler: ErrorHandler;
    protected userInfo: UserInfoAuth0;
    protected loginService: Login;

    constructor(errorHandler: ErrorHandler, loginService : Login) {
        this.loginService = loginService;
        this.errorHandler = errorHandler;
    }

    public loadAuthenticatedUser = async (req : r.Request, res : r.Response, next : r.Next) => {

        if (!req.header('Authorization')) {
            return next(this.errorHandler.logAndCreateUnautorized(
                req.path(), 'Token must be provided',
            ));
        }

        const access_token = req.header('Authorization').slice(7);
        try {
            this.userInfo = await this.loginService.auth0UserInfo(access_token);
            return next();
        } catch (err) {
            return next(this.errorHandler.logAndCreateUnautorized(req.path(), err));
        }
    }
}
export default RootCtrl;
