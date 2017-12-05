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
import { OK } from 'http-status-codes';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import * as sample from './sample';

describe('MessageCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let jwtParserMoq: TypeMoq.IMock<JwtParser>;
    let hotspotRepositoryMoq: TypeMoq.IMock<HotspotRepositoryInMemory>;
    let messageRepositoryMoq: TypeMoq.IMock<MessageRepositoryInMemory>;
    let messageCtrl: MessageCtrl;

    before(async () => {
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        // mock la lecture du header http contenant le jwt
        // simule la validation du jwt token
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        jwtParserMoq = TypeMoq.Mock.ofType<JwtParser>();
        sample.setupReqAuthorizationHeader(reqMoq, jwtParserMoq);

        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        messageRepositoryMoq = TypeMoq.Mock.ofType<MessageRepositoryInMemory>();
        messageCtrl = new MessageCtrl(
            jwtParserMoq.object, hotspotRepositoryMoq.object, messageRepositoryMoq.object);

        // appel du middleware de control d'acces de l'utilsateur
        await messageCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
    });

    describe('getMessages action', () => {

        let hotspotId: string;

        beforeEach(() => {
            hotspotId = 'fake-hotspot-id';
            reqMoq.setup(x => x.params).returns(() => {
                return {
                    hotspotId,
                };
            });
        });

        it.only ('should return a collection of messages related to a given hotspot', async () => {
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
            //
        });
    });
});
