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

    public login = (req : rest.Request, res : rest.Response, next : rest.Next) => {
        this.loginService.try(req.query.username, req.query.password)
        .then((body : any) => {
            if (body.error) {
                next(new restifyErrors.InvalidCredentialsError(body.error_description));
            } else {
                res.json(body);
            }
        })
        .catch((err : any) => {
            next(new restifyErrors.InvalidCredentialsError(err.message));
        });
    }
}
export default AuthCtrl;
