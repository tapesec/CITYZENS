import AuthCtrl from './../controllers/AuthCtrl';
import * as restify from 'restify';
import { AUTH_LOGIN } from './constants';


class AuthRouter {

    private ctrl: AuthCtrl;

    constructor(controller: AuthCtrl) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {

        server.get(
            AUTH_LOGIN, this.ctrl.login,
        );
    }
}

export default AuthRouter;
