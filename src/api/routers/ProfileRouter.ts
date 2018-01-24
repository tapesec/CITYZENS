import ProfileCtrl from '../controllers/ProfileCtrl';
import * as restify from 'restify';
import { FAVORIT_ENDPOINT } from './constants';


class ProfileRouter {

    private ctrl: ProfileCtrl;

    constructor(controller: ProfileCtrl) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {

        server.post(
            FAVORIT_ENDPOINT + '/:favoritHotspotId',
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.postFavorit,
        );
    }
}

export default ProfileRouter;
