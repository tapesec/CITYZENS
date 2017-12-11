import MessageSample from '../../../src/domain/cityLife/model/sample/MessageSample';
import HotspotId from '../../../src/domain/cityLife/model/hotspot/HotspotId';
import MessageFactory from '../../../src/infrastructure/MessageFactory';
import
messageRepositoryInMemory,
{ MessageRepositoryInMemory } from '../../../src/infrastructure/MessageRepositoryInMemory';
import * as TypeMoq from 'typemoq';
import * as sinon from 'sinon';
import { expect } from 'chai';

describe('MessageRepository', () => {

    let ormStub: any = {};
    let findAllStub: sinon.SinonStub;
    let findOneStub: any;
    let saveStub: any;
    let updateStub: any;
    let deleteStub: any;
    let repository: MessageRepositoryInMemory;
    let messageFactoryMock: TypeMoq.IMock<MessageFactory>;
    let fakeMessageId: string;

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
        fakeMessageId = 'fake-message-id';
        repository = new MessageRepositoryInMemory(ormStub, messageFactoryMock.object);
    });

    afterEach(() => {
        ormStub = {};
        repository = null;
    });

    describe('findByHotspotId', () => {

        it('should call orm findAll method with an hotspotId as request parameter', () => {
            // Arrange
            const fakeHotspotId = 'fake-id';
            const fakeDatafromDb = [
                { foo: 'bar' },
                { foo: 'bar' },
                { foo: 'bar' },
            ];
            findAllStub.returns(fakeDatafromDb);
            // Act
            repository.findByHotspotId(fakeHotspotId);
            // Assert
            expect(
                findAllStub.calledWith({ hotspotId: new HotspotId('fake-id').id, removed: false }),
            ).to.be.true;
            messageFactoryMock
            .verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.exactly(3),
            );
        });
    });

    describe('findById', () => {

        it ('should call orm findOne method and return a new Message', () => {
            // Arrange
            const fakeDatafromDb = { foo: 'bar' };
            findOneStub.returns(fakeDatafromDb);
            // Act
            repository.findById(fakeMessageId);
            // Assert
            expect(
                findOneStub.calledWith({ id: fakeMessageId, removed: false }),
            ).to.be.true;
            messageFactoryMock
            .verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.once(),
            );
        });

        it ('should call orm findOne method and return undefined if no entry from database', () => {
            // Arrange
            const emptyDatafromDb: any = undefined;
            findOneStub.returns(emptyDatafromDb);
            // Act
            repository.findById(fakeMessageId);
            // Assert
            expect(
                findOneStub.calledWith({ id: fakeMessageId, removed: false }),
            ).to.be.true;
            messageFactoryMock
            .verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.never(),
            );
        });
    });

    describe('isSet', () => {
        it ('should call orm findOne and return true when there is a message', () => {
            // Arrange
            const fakeDatafromDb = { foo: 'bar' };
            findOneStub.returns(fakeDatafromDb);
            // Act
            const isSet: boolean = repository.isSet(fakeMessageId);
            // Assert
            expect(
                findOneStub.calledWith({ id: fakeMessageId, removed: false }),
            ).to.be.true;
            expect(isSet).to.be.true;
        });

        it ('should call orm findOne and return false when there is not a message', () => {
            // Arrange
            const fakeDatafromDb: any = undefined;
            findOneStub.returns(fakeDatafromDb);
            // Act
            const isSet: boolean = repository.isSet(fakeMessageId);
            // Assert
            expect(
                findOneStub.calledWith({ id: fakeMessageId, removed: false }),
            ).to.be.true;
            expect(isSet).to.be.false;
        });
    });

    describe('store', () => {
        it ('should call orm save methode after stringify then parse a message object', () => {
            // Arrange
            const aMessage = MessageSample.MARTIGNAS_CHURCH_MESSAGE;;
            // Act
            repository.store(aMessage);
            // Assert
            expect(saveStub.calledWith(JSON.parse(JSON.stringify(aMessage)))).to.be.true;
        });
    });

    describe('store', () => {
        it ('should call orm update methode after stringify then parse a message object', () => {
            // Arrange
            const aMessage = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
            // Act
            repository.update(aMessage);
            // Assert
            expect(updateStub.calledWith(JSON.parse(JSON.stringify(aMessage)))).to.be.true;
        });
    });

    describe('delete', () => {
        it ('should call orm delete methode with message id parameter', () => {
            // Act
            repository.delete(fakeMessageId);
            // Assert
            expect(deleteStub.calledWith(fakeMessageId)).to.be.true;
        });
    });
});