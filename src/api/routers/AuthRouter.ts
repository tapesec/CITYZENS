import AuthCtrl from './../controllers/AuthCtrl';
import * as restify from 'restify';
import { AUTH_LOGIN } from './constants';
import UserLoader from '../middlewares/UserLoader';

class AuthRouter {
    private ctrl: AuthCtrl;

    constructor(controller: AuthCtrl, userLoader: UserLoader) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {
        server.post(AUTH_LOGIN, this.ctrl.login);
    }
}

export default AuthRouter;
