import MessageSample from '../../../../../src/domain/cityLife/model/sample/MessageSample';
import Message from '../../../../../src/domain/cityLife/model/messages/Message';
import HotspotId from '../../../../../src/domain/cityLife/model/hotspot/HotspotId';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';
import { v4 } from 'uuid';
import { expect } from 'chai';

describe('Message entity', () => {

    it ('should have correct properties', () => {
        // Arrange
        const id = v4();
        const hotspotId = new HotspotId(v4());
        const title = 'a fake title';
        const body = 'lorem ipsum';
        const author = AuthorSample.ELODIE;
        const pinned = true;
        const createdAt = new Date();
        const updatedAt = new Date();
        // Act
        const newMessage = new Message(
            id, title, body, author, pinned, hotspotId, createdAt, new Date());
        // Assert
        expect(newMessage).to.have.property('title').to.equal(title);
        expect(newMessage).to.have.property('body').to.equal(body);
        expect(newMessage).to.have.property('id').to.equal(id);
        expect(newMessage).to.have.property('author').to.equal(AuthorSample.ELODIE);
        expect(newMessage).to.have.property('createdAt').to.eql(createdAt);
        expect(newMessage).to.have.property('updatedAt').to.eql(updatedAt);
        expect(newMessage).to.have.property('pinned').to.equal(true);
    });

    it ('should change the title', () => {
        // Arrange
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const newTitle = 'now changing title';
        // Act
        message.changeTitle(newTitle);
        // Assert
        expect(message.title).to.be.equal(newTitle);
    });

    it ('should edit a message', () => {
        // Arrange
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const newBody = 'now updating text';
        // Act
        message.editBody(newBody);
        // Assert
        expect(message.body).to.be.equal(newBody);
    });

    it ('should toggle pinmode of a message', () => {
        // Arrange
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const isPinned = MessageSample.MARTIGNAS_CHURCH_MESSAGE.pinned;
        // Act
        message.togglePinMode();
        // Assert
        expect(MessageSample.MARTIGNAS_CHURCH_MESSAGE.pinned).to.be.equal(!isPinned);
    });
});
