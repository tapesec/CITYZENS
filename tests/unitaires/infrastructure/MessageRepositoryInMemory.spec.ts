import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import HotspotId from '../../../src/domain/model/HotspotId';
import MessageId from '../../../src/domain/model/MessageId';
import MessageSample from '../../../src/domain/model/sample/MessageSample';
import MessageFactory from '../../../src/infrastructure/MessageFactory';
import MessageRepositoryPostgreSQL from '../../../src/infrastructure/MessageRepositoryPostgreSQL';
import OrmMessage from '../../../src/infrastructure/ormMessage';

describe('MessageRepository', () => {
    let repository: MessageRepositoryPostgreSQL;
    let messageFactoryMock: TypeMoq.IMock<MessageFactory>;
    let ormMessage: TypeMoq.IMock<OrmMessage>;

    beforeEach('should mock orm before test MessageRepository', () => {
        ormMessage = TypeMoq.Mock.ofType<OrmMessage>();
        messageFactoryMock = TypeMoq.Mock.ofType<MessageFactory>();
        repository = new MessageRepositoryPostgreSQL(ormMessage.object, messageFactoryMock.object);
    });

    describe('findByHotspotId', () => {
        it('should call orm findAll method with an hotspotId as request parameter', async () => {
            // Arrange
            const fakeHotspotId = new HotspotId('fake-id');
            const fakeDatafromDb = [{ foo: 'bar' }, { foo: 'bar' }, { foo: 'bar' }];
            ormMessage
                .setup(x => x.findAll(TypeMoq.It.isAny()))
                .returns(() => Promise.resolve(fakeDatafromDb));
            // Act
            await repository.findByHotspotId(fakeHotspotId);
            // Assert
            ormMessage.verify(x => x.findAll(TypeMoq.It.isAny()), TypeMoq.Times.once());
            messageFactoryMock.verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.exactly(3),
            );
        });
    });

    describe('findById', () => {
        it('should call orm findOne method and return a new Message', async () => {
            // Arrange
            // Arrange
            const fakeMessageId = new MessageId('fake-id');
            const fakeDatafromDb: any = { foo: 'bar' };
            ormMessage
                .setup(x => x.findOne(fakeMessageId))
                .returns(() => Promise.resolve(fakeDatafromDb));
            // Act
            await repository.findById(fakeMessageId);
            // Assert
            ormMessage.verify(x => x.findOne(fakeMessageId), TypeMoq.Times.once());
            messageFactoryMock.verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.once(),
            );
        });

        it('should call orm findOne method and return undefined if no entry from database', async () => {
            // Arrange
            const fakeMessageId = new MessageId('fake-id');
            const emptyDatafromDb: any = undefined;
            ormMessage
                .setup(x => x.findOne(fakeMessageId))
                .returns(() => Promise.resolve(undefined));
            // Act
            await repository.findById(fakeMessageId);
            // Assert
            ormMessage.verify(x => x.findOne(fakeMessageId), TypeMoq.Times.once());
            messageFactoryMock.verify(
                x => x.createMessage(TypeMoq.It.isAny()),
                TypeMoq.Times.never(),
            );
        });
    });

    describe('isSet', () => {
        it('should call orm findOne and return true when there is a message', async () => {
            // Arrange
            const fakeMessageId = new MessageId('fake-id');
            const fakeDatafromDb: any = { foo: 'bar' };
            ormMessage
                .setup(x => x.findOne(fakeMessageId))
                .returns(() => Promise.resolve(fakeDatafromDb));
            // Act
            const isSet: boolean = await repository.isSet(fakeMessageId);
            // Assert
            ormMessage.verify(x => x.findOne(fakeMessageId), TypeMoq.Times.once());
            expect(isSet).to.be.true;
        });

        it('should call orm findOne and return false when there is not a message', async () => {
            // Arrange
            const fakeMessageId = new MessageId('fake-id');
            const fakeDatafromDb: any = undefined;
            ormMessage
                .setup(x => x.findOne(fakeMessageId))
                .returns(() => Promise.resolve(fakeDatafromDb));
            // Act
            const isSet: boolean = await repository.isSet(fakeMessageId);
            // Assert
            ormMessage.verify(x => x.findOne(fakeMessageId), TypeMoq.Times.once());
            expect(isSet).to.be.false;
        });
    });

    describe('store', () => {
        it('should call orm save methode after stringify then parse a message object', async () => {
            // Arrange
            const aMessage = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
            // Act
            await repository.store(aMessage);
            // Assert
            ormMessage.verify(x => x.save(aMessage), TypeMoq.Times.once());
        });

        it('should call orm update methode after stringify then parse a message object', async () => {
            // Arrange
            const aMessage = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
            // Act
            await repository.update(aMessage);
            // Assert
            ormMessage.verify(x => x.update(aMessage), TypeMoq.Times.once());
        });
    });

    describe('delete', () => {
        it('should call orm delete methode with message id parameter', async () => {
            const fakeMessageId = new MessageId('fake-id');
            // Act
            await repository.delete(fakeMessageId);
            // Assert
            ormMessage.verify(x => x.delete(fakeMessageId), TypeMoq.Times.once());
        });
    });
});
