import RootCtrl from './RootCtrl';
import { Response } from '_debugger';
import * as rest from 'restify';
import Login from './../services/auth/Login';
import JwtParser from './../services/auth/JwtParser';
import * as restifyErrors from 'restify-errors';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';

class AuthCtrl extends RootCtrl {

    private loginService : Login;

    constructor(
        errorHandler: ErrorHandler,
        loginService : Login) {
        super(errorHandler);
        this.loginService = loginService;
    }

    public login = async (req : rest.Request, res : rest.Response, next : rest.Next) => {
        try {
            const body : any = await this.loginService.try(req.query.username, req.query.password);
            if (body.error) {
                return next(new restifyErrors.InvalidCredentialsError(body.error_description));
            }
            res.json(body);
        } catch (err) {
            return this.errorHandler.logInternal(err.message, `DELETE ${req.path()}`, next);
        }
    }
}
export default AuthCtrl;
