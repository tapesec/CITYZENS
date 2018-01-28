import MessageCtrl from '../controllers/MessageCtrl';
import * as restify from 'restify';
import { HOTSPOT_ENDPOINT, MESSAGE_ENDPOINT } from './constants';


class MessageRouter {

    private ctrl: MessageCtrl;

    constructor(controller: MessageCtrl) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {

        server.get(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT,
            this.ctrl.getMessages,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.postMessage,
        );

        server.patch(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId',
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.patchMessage,
        );

        server.del(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId',
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.removeMessage,
        );
    }
}

export default MessageRouter;
