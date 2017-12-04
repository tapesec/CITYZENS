import HotspotId from '../../../src/domain/cityLife/model/hotspot/HotspotId';
import MessageFactory from '../../../src/infrastructure/MessageFactory';
import
messageRepositoryInMemory,
{ MessageRepositoryInMemory } from '../../../src/infrastructure/MessageRepositoryInMemory';
import * as TypeMoq from 'typemoq';
import * as sinon from 'sinon';
import { expect } from 'chai';

describe('MessageRepository', () => {

    describe('findByHotspotId', () => {

        let ormStub: any = {};
        let findAllStub: sinon.SinonStub;
        let findOneStub: any;
        let saveStub: any;
        let updateStub: any;
        let deleteStub: any;
        let messageRepository: MessageRepositoryInMemory;
        let messageFactoryMock: TypeMoq.IMock<MessageFactory>;

        beforeEach('should mock orm before test MessageRepository', () => {
            findAllStub = sinon.stub();
            findOneStub = sinon.stub();
            saveStub = sinon.stub();
            updateStub = sinon.stub();
            deleteStub = sinon.stub();
            ormStub.message = {
                findAll: findAllStub,
                findOne: findOneStub,
                save: saveStub,
                update: updateStub,
                delete: deleteStub,
            };
            messageFactoryMock = TypeMoq.Mock.ofType<MessageFactory>();
        });

        afterEach(() => {
            ormStub = {};
            messageRepository = null;
        });

        it('should call orm findAll method with an hotspotId as request parameter', () => {
            // Arrange
            const fakeHotspotId = 'fake-id';
            const fakeDatafromDb = [
                { foo: 'bar' },
                { foo: 'bar' },
                { foo: 'bar' },
            ];
            findAllStub.returns(fakeDatafromDb);
            const repository = new MessageRepositoryInMemory(ormStub, messageFactoryMock.object);
            // Act
            repository.findByHotspotId(fakeHotspotId);
            // Assert
            expect(findAllStub.calledWith({ hotspotId: new HotspotId('fake-id').id })).to.be.true;
            messageFactoryMock
            .verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.exactly(3),
            );
        });
    });
});
