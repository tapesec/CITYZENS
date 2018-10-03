import AuthCtrl from './../controllers/AuthCtrl';
import * as restify from 'restify';
import { AUTH_LOGIN, SIGNUP_ENDPOINT } from './constants';
import UserLoader from '../middlewares/UserLoader';

class AuthRouter {
    private ctrl: AuthCtrl;

    constructor(controller: AuthCtrl, userLoader: UserLoader) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {
        server.post(AUTH_LOGIN, this.ctrl.login);
        server.post(SIGNUP_ENDPOINT, this.ctrl.signup);
    }
}

export default AuthRouter;
