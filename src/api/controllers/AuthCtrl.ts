import RootCtrl from './RootCtrl';
import { Response } from '_debugger';
import * as rest from 'restify';
import Login from './../services/auth/Login';
import JwtParser from './../services/auth/JwtParser';
import * as restifyErrors from 'restify-errors';

class AuthCtrl extends RootCtrl {

    private loginService : Login;

    constructor(loginService : Login) {
        super();
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
            return this.nextInternalError(next, err.message, `DELETE ${req.path()}`);
        }
    }
}
export default AuthCtrl;
