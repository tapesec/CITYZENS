import * as restify from 'restify';
import MessageCtrl from '../controllers/MessageCtrl';
import { COMMENT_ENDPOINT, HOTSPOT_ENDPOINT, MESSAGE_ENDPOINT } from './constants';
import UserLoader from '../middlewares/UserLoader';

class MessageRouter {
    constructor(protected ctrl: MessageCtrl, protected userLoader: UserLoader) {}

    bind(server: restify.Server) {
        server.get(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT,
            this.userLoader.optInAuthenticateUser,
            this.ctrl.getMessages,
        );

        server.get(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId' + COMMENT_ENDPOINT,
            this.userLoader.optInAuthenticateUser,
            this.ctrl.getComments,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT,
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.postMessage,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId' + COMMENT_ENDPOINT,
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.postComment,
        );

        server.patch(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId',
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.patchMessage,
        );

        server.del(
            HOTSPOT_ENDPOINT + '/:hotspotId' + MESSAGE_ENDPOINT + '/:messageId',
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.removeMessage,
        );
    }
}

export default MessageRouter;
