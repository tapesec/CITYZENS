import cityzenFromJwt from '../../../../src/api/services/cityzen/cityzenFromJwt';
import MessageFactory from '../../../../src/infrastructure/MessageFactory';
import MessageSample from '../../../../src/domain/cityLife/model/sample/MessageSample';
import IHotspotRepository from '../../../../src/domain/cityLife/model/hotspot/IHotspotRepository';
import
messageRepositoryInMemory,
{ MessageRepositoryInMemory } from '../../../../src/infrastructure/MessageRepositoryInMemory';
import
hotspotRepositoryInMemory,
{ HotspotRepositoryInMemory } from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import MessageCtrl from '../../../../src/api/controllers/MessageCtrl';
import JwtParser from '../../../../src/api/services/auth/JwtParser';
import { OK, CREATED, getStatusText } from 'http-status-codes';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import * as sample from './sample';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';

describe('MessageCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let hotspotRepositoryMoq: TypeMoq.IMock<HotspotRepositoryInMemory>;
    let messageRepositoryMoq: TypeMoq.IMock<MessageRepositoryInMemory>;
    let messageFactoryMoq: TypeMoq.IMock<MessageFactory>;
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let messageCtrl: MessageCtrl;
    let hotspotId: string;

    before(async () => {
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        // mock la lecture du header http contenant le jwt
        // simule la validation du jwt token
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();

        hotspotId = 'fake-hotspot-id';

        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        messageRepositoryMoq = TypeMoq.Mock.ofType<MessageRepositoryInMemory>();
        messageFactoryMoq = TypeMoq.Mock.ofType<MessageFactory>();
        messageCtrl = new MessageCtrl(
            errorHandlerMoq.object, {},
            hotspotRepositoryMoq.object, messageRepositoryMoq.object, messageFactoryMoq.object);

        // appel du middleware de control d'acces de l'utilsateur
        await messageCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
    });

    describe('getMessages action', () => {

        beforeEach(() => {
            hotspotId = 'fake-hotspot-id';
            reqMoq.setup(x => x.params).returns(() => {
                return {
                    hotspotId,
                };
            });
        });

        afterEach(() => {
            hotspotRepositoryMoq.reset();
            messageRepositoryMoq.reset();
            reqMoq.reset();
        });

        it ('should return a collection of messages related to a given hotspot', async () => {
            // Arrange
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => true);
            const fakeMessageCollection = [MessageSample.MARTIGNAS_TOWNHALL_MESSAGE];
            messageRepositoryMoq
            .setup(x => x.findByHotspotId(hotspotId))
            .returns(() => fakeMessageCollection);
            // Act
            await messageCtrl.getMessages(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            hotspotRepositoryMoq.verify(x => x.isSet(hotspotId), TypeMoq.Times.once());
            messageRepositoryMoq.verify(x => x.findByHotspotId(hotspotId), TypeMoq.Times.once());
            resMoq.verify(x => x.json(OK, fakeMessageCollection), TypeMoq.Times.once());
        });

        it ('should return 404 if no hospot was found according to given hotspotId', async() => {
            // Arrange
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => false);
            // Act
            await messageCtrl.getMessages(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            hotspotRepositoryMoq.verify(x => x.isSet(hotspotId), TypeMoq.Times.once());
            messageRepositoryMoq.verify(x => x.findByHotspotId(hotspotId), TypeMoq.Times.never());
        });
    });

    describe('postMessage action', () => {

        beforeEach(() => {
            reqMoq.setup(x => x.params).returns(() => {
                return {
                    hotspotId,
                };
            });
        });

        afterEach(() => {
            hotspotRepositoryMoq.reset();
            messageRepositoryMoq.reset();
            reqMoq.reset();
            resMoq.reset();
        });

        it ('create a new message and store it in repository then respond created', async () => {
            // Arrange
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => true);
            const reqBody: any = {
                title: 'fake-title',
                body: 'lorem ipsum',
                pinned: true,
            };
            reqMoq.setup(x => x.body).returns(() => reqBody);
            reqBody.hotspotId = hotspotId;
            reqBody.cityzen = {};
            messageFactoryMoq.setup(x => x.createMessage(reqBody))
            .returns(() => MessageSample.MARTIGNAS_SCHOOL_MESSAGE);
            // Act
            await messageCtrl.postMessage(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            messageFactoryMoq.verify(x => x.createMessage(reqBody), TypeMoq.Times.once());
            messageRepositoryMoq
            .verify(x => x.store(MessageSample.MARTIGNAS_SCHOOL_MESSAGE), TypeMoq.Times.once());
            resMoq
            .verify(
                x => x.json(CREATED, MessageSample.MARTIGNAS_SCHOOL_MESSAGE), TypeMoq.Times.once());
        });
    });

    describe('patchMessage action', () => {

        let messageId: string;

        beforeEach(() => {
            messageId = 'fake-message-id';
            reqMoq.setup(x => x.params).returns(() => {
                return {
                    hotspotId,
                    messageId,
                };
            });
        });

        afterEach(() => {
            messageRepositoryMoq.reset();
            reqMoq.reset();
            resMoq.reset();
        });

        it ('should change title message if title passed in request body', async () => {
            // Arrange
            const reqBody: any = {
                title: 'fake-title',
                body: 'lorem ipsum',
                pinned: true,
            };
            const message = MessageSample.MARTIGNAS_SCHOOL_MESSAGE;
            reqMoq.setup(x => x.body).returns(() => reqBody);
            messageRepositoryMoq
            .setup(x => x.findById(messageId))
            .returns(() => message);
            message.changeTitle('fake-title');
            message.editBody('lorem ipsum');
            message.togglePinMode();
            // Act
            await messageCtrl.patchMessage(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            messageRepositoryMoq.verify(x => x.update(message), TypeMoq.Times.once());
            resMoq.verify(x => x.json(OK, message), TypeMoq.Times.once());
        });
    });

    describe('deleteMessage action', () => {
        let messageId: string;

        beforeEach(() => {
            messageId = 'fake-message-id';
            reqMoq.setup(x => x.params).returns(() => {
                return {
                    hotspotId,
                    messageId,
                };
            });
        });

        afterEach(() => {
            messageRepositoryMoq.reset();
            reqMoq.reset();
            resMoq.reset();
        });

        it ('should remove a message', async () => {
            // Arrange
            messageRepositoryMoq.setup(x => x.isSet(messageId)).returns(() => true);
            // Act
            await messageCtrl.removeMessage(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            messageRepositoryMoq.verify(x => x.delete(messageId), TypeMoq.Times.once());
            resMoq.verify(x => x.json(OK, getStatusText(OK)), TypeMoq.Times.once());
        });
    });
});
