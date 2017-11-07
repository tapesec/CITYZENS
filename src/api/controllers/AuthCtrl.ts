import RootCtrl from './RootCtrl';
import { Response } from '_debugger';
import * as rest from 'restify';
import Login from './../services/auth/Login';
import JwtParser from './../services/auth/JwtParser';
const restifyErrors = require('restify-errors');

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
            } else {
                res.json(body);
            }
        } catch (err) {
            next(new restifyErrors.InvalidCredentialsError(err.message));
        }
    }
}
export default AuthCtrl;
