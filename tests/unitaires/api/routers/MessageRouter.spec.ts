import MessageFactory from '../../../../src/infrastructure/MessageFactory';
import JwtParser from '../../../../src/api/services/auth/JwtParser';
import hotspotRepositoryInMemory
from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import messageRepositoryInMemory
from '../../../../src/infrastructure/MessageRepositoryInMemory';
import MessageRouter from '../../../../src/api/routers/MessageRouter';
import * as TypeMoq from 'typemoq';
import * as restify from 'restify';
import { expect } from 'chai';
import MessageCtrl from '../../../../src/api/controllers/MessageCtrl';
import * as c from '../../../../src/api/routers/constants';

describe('messages router', () => {

    it('should register routes related to messages', () => {
        // Arrange
        const serverMock : TypeMoq.IMock<restify.Server> = TypeMoq.Mock.ofType<restify.Server>();
        const jwtParser : TypeMoq.IMock<JwtParser> = TypeMoq.Mock.ofType<JwtParser>();
        const messageCtrl : TypeMoq.IMock<MessageCtrl> =
        TypeMoq.Mock.ofType(
            MessageCtrl,
            TypeMoq.MockBehavior.Loose,
            true,
            jwtParser,
            hotspotRepositoryInMemory,
            messageRepositoryInMemory,
            new MessageFactory(),
        );
        const messageRouter = new MessageRouter(messageCtrl.object);
        // Act
        messageRouter.bind(serverMock.object);
        // Assert
        serverMock.verify(
            x => x.get(
                c.HOTSPOT_ENDPOINT + '/:hotspotId' + c.MESSAGE_ENDPOINT,
                messageCtrl.object.getMessages),
            TypeMoq.Times.once(),
        );
        serverMock.verify(
            x => x.post(
                c.HOTSPOT_ENDPOINT + '/:hotspotId' + c.MESSAGE_ENDPOINT,
                messageCtrl.object.loadAuthenticatedUser,
                messageCtrl.object.postMessage),
            TypeMoq.Times.once(),
        );
        serverMock.verify(
            x => x.patch(
                c.HOTSPOT_ENDPOINT + '/:hotspotId' + c.MESSAGE_ENDPOINT + '/:messageId',
                messageCtrl.object.loadAuthenticatedUser,
                messageCtrl.object.patchMessage),
            TypeMoq.Times.once(),
        );
        serverMock.verify(
            x => x.del(
                c.HOTSPOT_ENDPOINT + '/:hotspotId' + c.MESSAGE_ENDPOINT + '/:messageId',
                messageCtrl.object.loadAuthenticatedUser,
                messageCtrl.object.removeMessage),
            TypeMoq.Times.once(),
        );
    });
});
