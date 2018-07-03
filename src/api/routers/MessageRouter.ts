import * as restify from 'restify';
import MessageCtrl from '../controllers/MessageCtrl';
import { COMMENT_ENDPOINT, HOTSPOT_ENDPOINT, MESSAGE_ENDPOINT } from './constants';

class MessageRouter {
    private ctrl: MessageCtrl;

    constructor(controller: MessageCtrl) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {
        server.get(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT,
            this.ctrl.optInAuthenticateUser,
            this.ctrl.getMessages,
        );

        server.get(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId' + COMMENT_ENDPOINT,
            this.ctrl.optInAuthenticateUser,
            this.ctrl.getComments,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.postMessage,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId' + COMMENT_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.postComment,
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
