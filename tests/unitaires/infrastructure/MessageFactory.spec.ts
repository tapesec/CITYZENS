import CityzenSample from '../../../src/domain/cityzens/model/CityzenSample';
import MessageFactory from '../../../src/infrastructure/MessageFactory';
import { expect } from 'chai';

describe('MessageFactory', () => {

    it ('createMessage called with data from request body should return a new message', () => {
        // Arrange
        const fakeDataFromRequestPost : any = {
            title: 'new title',
            body: 'fake message body',
            pinned: true,
        };

        fakeDataFromRequestPost.cityzen = CityzenSample.ELODIE;
        const messageFactory = new MessageFactory();
        // Act
        const fakeNewMessage = messageFactory.createMessage(fakeDataFromRequestPost);
        // Assert
        expect(fakeNewMessage).to.have.property('id');
        commonMessagePropertiesAssertion(fakeNewMessage);
    });

    it ('createMessage called with data from database should return a new message', () => {
        // Arrange
        const fakeDataFromDatabase : any = {
            id: 'fake-id',
            title: 'new title',
            body: 'fake message body',
            pinned: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const hotspotMessage = new MessageFactory();
        // Act
        const fakeNewMessage = hotspotMessage.createMessage(fakeDataFromDatabase);
        // Assert
        expect(fakeNewMessage).to.have.property('id').and.to.be.equal('fake-id');
        expect(fakeNewMessage).to.have.property('createdAt')
        .to.be.eql(new Date(fakeDataFromDatabase.createdAt));
        expect(fakeNewMessage).to.have.property('updatedAt')
        .to.be.eql(new Date(fakeDataFromDatabase.updatedAt));
        commonMessagePropertiesAssertion(fakeNewMessage);
    });
});

const commonMessagePropertiesAssertion = (fakeNewMessage : any) : void => {
    expect(fakeNewMessage).to.have.property('title').and.to.be.equal('new title');
    expect(fakeNewMessage).to.have.property('pinned').and.to.be.equal(true);
    expect(fakeNewMessage).to.have.property('body').and.to.be.equal('fake message body');
};
