import { CREATED, getStatusText, OK } from 'http-status-codes';
import * as rest from 'restify';
import * as TypeMoq from 'typemoq';
import MessageCtrl from '../../../../src/api/controllers/MessageCtrl';
import Auth0Service from '../../../../src/api/services/auth/Auth0Service';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import HotspotId from '../../../../src/domain/model/HotspotId';
import MessageId from '../../../../src/domain/model/MessageId';
import MediaHotspotSample from '../../../../src/domain/model/sample/MediaHotspotSample';
import MessageSample from '../../../../src/domain/model/sample/MessageSample';
import CityzenId from '../../../../src/domain/cityzens/model/CityzenId';
import CityzenSample from '../../../../src/domain/cityzens/model/CityzenSample';
import CityzenRepositoryPostgreSQL from '../../../../src/infrastructure/CityzenRepositoryPostgreSQL';
import HotspotRepositoryInMemory from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import MessageFactory from '../../../../src/infrastructure/MessageFactory';
import MessageRepositoryPostgreSql from '../../../../src/infrastructure/MessageRepositoryPostgreSQL';
import { FAKE_ADMIN_USER_INFO_AUTH0, FAKE_USER_INFO_AUTH0 } from '../services/samples';

describe('MessageCtrl', () => {
    let reqMoq: TypeMoq.IMock<rest.Request>;
    let resMoq: TypeMoq.IMock<rest.Response>;
    let nextMoq: TypeMoq.IMock<rest.Next>;
    let auth0ServiceMoq: TypeMoq.IMock<Auth0Service>;
    let hotspotRepositoryMoq: TypeMoq.IMock<HotspotRepositoryInMemory>;
    let messageRepositoryMoq: TypeMoq.IMock<MessageRepositoryPostgreSql>;
    let messageFactoryMoq: TypeMoq.IMock<MessageFactory>;
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let messageCtrl: MessageCtrl;
    let cityzenRepositoryMoq: TypeMoq.IMock<CityzenRepositoryPostgreSQL>;
    let hotspotId: string;

    before(async () => {
        hotspotId = 'fake-hotspot-id';
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        cityzenRepositoryMoq = TypeMoq.Mock.ofType();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
        auth0ServiceMoq = TypeMoq.Mock.ofType<Auth0Service>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        messageRepositoryMoq = TypeMoq.Mock.ofType<MessageRepositoryPostgreSql>();
        messageFactoryMoq = TypeMoq.Mock.ofType<MessageFactory>();

        reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');

        auth0ServiceMoq
            .setup(x => x.getUserInfo('my authorisation'))
            .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

        cityzenRepositoryMoq
            .setup(x => x.findById(new CityzenId(FAKE_USER_INFO_AUTH0.sub)))
            .returns(() => Promise.resolve(CityzenSample.MARTIN));
        cityzenRepositoryMoq
            .setup(x => x.findById(new CityzenId(FAKE_ADMIN_USER_INFO_AUTH0.sub)))
            .returns(() => Promise.resolve(CityzenSample.LUCA));

        messageCtrl = new MessageCtrl(
            errorHandlerMoq.object,
            auth0ServiceMoq.object,
            cityzenRepositoryMoq.object,
            hotspotRepositoryMoq.object,
            messageRepositoryMoq.object,
            messageFactoryMoq.object,
        );

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

        it('should return a collection of messages related to a given hotspot', async () => {
            // Arrange
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => true);
            hotspotRepositoryMoq
                .setup(x => x.findById(hotspotId))
                .returns(() => Promise.resolve(MediaHotspotSample.CHURCH));
            const fakeMessageCollection = [MessageSample.MARTIGNAS_TOWNHALL_MESSAGE];
            messageRepositoryMoq
                .setup(x => x.findByHotspotId(new HotspotId(hotspotId)))
                .returns(() => Promise.resolve(fakeMessageCollection));
            // Act
            await messageCtrl.getMessages(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            hotspotRepositoryMoq.verify(x => x.isSet(hotspotId), TypeMoq.Times.once());
            messageRepositoryMoq.verify(
                x => x.findByHotspotId(new HotspotId(hotspotId)),
                TypeMoq.Times.once(),
            );
            resMoq.verify(x => x.json(OK, fakeMessageCollection), TypeMoq.Times.once());
        });

        it('should return 404 if no hospot was found according to given hotspotId', async () => {
            // Arrange
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => false);
            // Act
            await messageCtrl.getMessages(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            hotspotRepositoryMoq.verify(x => x.isSet(hotspotId), TypeMoq.Times.once());
            messageRepositoryMoq.verify(
                x => x.findByHotspotId(new HotspotId(hotspotId)),
                TypeMoq.Times.never(),
            );
        });

        it('Should return unauthorized on a private message', async () => {
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => true);
            hotspotRepositoryMoq
                .setup(x => x.findById(hotspotId))
                .returns(() => Promise.resolve(MediaHotspotSample.DOCTOR));
            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            await messageCtrl.getMessages(reqMoq.object, resMoq.object, nextMoq.object);

            hotspotRepositoryMoq.verify(x => x.isSet(hotspotId), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.findById(hotspotId), TypeMoq.Times.once());
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });
    });

    describe('postMessage action', () => {
        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');

            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_ADMIN_USER_INFO_AUTH0));

            await messageCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        afterEach(() => {
            hotspotRepositoryMoq.reset();
            messageRepositoryMoq.reset();
            reqMoq.reset();
            resMoq.reset();
        });

        it('create a new message and store it in repository then respond created', async () => {
            const reqBody: any = {
                hotspotId: 'fake-hotspot-id',
                title: 'fake-title',
                body: 'lorem ipsum',
                pinned: true,
            };
            const reqParam = {
                hotspotId,
            };

            // Arrange
            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => true);
            hotspotRepositoryMoq
                .setup(x => x.findById(hotspotId))
                .returns(() => Promise.resolve(MediaHotspotSample.SCHOOL));

            messageFactoryMoq
                .setup(x => x.createMessage(TypeMoq.It.isAny()))
                .returns(() => MessageSample.MARTIGNAS_SCHOOL_MESSAGE);

            reqMoq.setup(x => x.params).returns(() => reqParam);
            reqMoq.setup(x => x.body).returns(() => reqBody);
            // Act
            await messageCtrl.postMessage(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            messageFactoryMoq.verify(x => x.createMessage(reqBody), TypeMoq.Times.once());
            messageRepositoryMoq.verify(
                x => x.store(MessageSample.MARTIGNAS_SCHOOL_MESSAGE),
                TypeMoq.Times.once(),
            );
            resMoq.verify(
                x => x.json(CREATED, MessageSample.MARTIGNAS_SCHOOL_MESSAGE),
                TypeMoq.Times.once(),
            );
        });
    });

    describe('patchMessage action', () => {
        let messageId: string;

        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');

            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_ADMIN_USER_INFO_AUTH0));

            await messageCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);

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

        it('should change title message if title passed in request body', async () => {
            // Arrange
            const reqBody: any = {
                title: 'fake-title',
                body: 'lorem ipsum',
                pinned: true,
            };
            const message = MessageSample.MARTIGNAS_SCHOOL_MESSAGE;
            message.changeTitle('fake-title');
            message.editBody('lorem ipsum');
            message.togglePinMode();

            hotspotRepositoryMoq.setup(x => x.isSet(hotspotId)).returns(() => true);
            hotspotRepositoryMoq
                .setup(x => x.findById(hotspotId))
                .returns(() => Promise.resolve(MediaHotspotSample.SCHOOL));

            messageRepositoryMoq
                .setup(x => x.findById(new MessageId(messageId)))
                .returns(() => Promise.resolve(message));

            reqMoq.setup(x => x.body).returns(() => reqBody);

            // Act
            await messageCtrl.patchMessage(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            messageRepositoryMoq.verify(x => x.update(message), TypeMoq.Times.once());
            resMoq.verify(x => x.json(OK, message), TypeMoq.Times.once());
        });
    });

    describe('deleteMessage action', () => {
        let messageId: string;

        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');

            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_ADMIN_USER_INFO_AUTH0));

            await messageCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);

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

        it('should remove a message', async () => {
            // Arrange
            messageRepositoryMoq
                .setup(x => x.isSet(new MessageId(messageId)))
                .returns(() => Promise.resolve(true));
            // Act
            await messageCtrl.removeMessage(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            messageRepositoryMoq.verify(
                x => x.delete(new MessageId(messageId)),
                TypeMoq.Times.once(),
            );
            resMoq.verify(x => x.json(OK, getStatusText(OK)), TypeMoq.Times.once());
        });
    });
});
