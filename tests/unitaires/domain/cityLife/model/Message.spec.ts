import { expect } from 'chai';
import { v4 } from 'uuid';
import HotspotId from '../../../../../src/domain/model/HotspotId';
import Message from '../../../../../src/domain/model/Message';
import MessageId from '../../../../../src/domain/model/MessageId';
import AuthorSample from '../../../../../src/domain/model/sample/AuthorSample';
import MessageSample from '../../../../../src/domain/model/sample/MessageSample';

describe('Message entity', () => {
    it('should have correct properties', () => {
        // Arrange
        const id = new MessageId(v4());
        const hotspotId = new HotspotId(v4());
        const title = 'a fake title';
        const body = 'lorem ipsum';
        const author = AuthorSample.ELODIE;
        const pinned = true;
        const createdAt = new Date();
        const updatedAt = new Date();
        // Act
        const newMessage = new Message(
            id,
            title,
            body,
            author,
            pinned,
            hotspotId,
            undefined,
            createdAt,
            updatedAt,
        );
        // Assert
        expect(newMessage)
            .to.have.property('title')
            .to.equal(title);
        expect(newMessage)
            .to.have.property('body')
            .to.equal(body);
        expect(newMessage)
            .to.have.property('id')
            .to.equal(id);
        expect(newMessage)
            .to.have.property('author')
            .to.equal(AuthorSample.ELODIE);
        expect(newMessage)
            .to.have.property('createdAt')
            .to.eql(createdAt);
        expect(newMessage)
            .to.have.property('updatedAt')
            .to.eql(updatedAt);
        expect(newMessage)
            .to.have.property('pinned')
            .to.equal(true);
        expect(newMessage).to.have.property('parentId').to.be.undefined;
    });

    it('should change the title', () => {
        // Arrange
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const newTitle = 'now changing title';
        // Act
        message.changeTitle(newTitle);
        // Assert
        expect(message.title).to.be.equal(newTitle);
    });

    it('should edit a message', () => {
        // Arrange
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const newBody = 'now updating text';
        // Act
        message.editBody(newBody);
        // Assert
        expect(message.body).to.be.equal(newBody);
    });

    it('should toggle pinmode of a message', () => {
        // Arrange
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const isPinned = MessageSample.MARTIGNAS_CHURCH_MESSAGE.pinned;
        // Act
        message.togglePinMode();
        // Assert
        expect(MessageSample.MARTIGNAS_CHURCH_MESSAGE.pinned).to.be.equal(!isPinned);
    });

    it('should toggle pinmode of a message', () => {
        const message = MessageSample.MARTIGNAS_CHURCH_MESSAGE;
        const jsonMessage = JSON.parse(JSON.stringify(message));

        expect(jsonMessage)
            .to.have.property('author')
            .to.have.property('id')
            .to.be.equal(message.author.id.toString());

        expect(jsonMessage)
            .to.have.property('author')
            .to.have.property('pseudo')
            .to.be.equal(message.author.pseudo);

        expect(jsonMessage)
            .to.have.property('body')
            .to.be.equal(message.body);

        expect(jsonMessage)
            .to.have.property('createdAt')
            .to.be.equal(message.createdAt.toJSON());

        expect(jsonMessage)
            .to.have.property('updatedAt')
            .to.be.equal(message.updatedAt.toJSON());

        expect(jsonMessage)
            .to.have.property('hotspotId')
            .to.be.equal(message.hotspotId.toString());

        expect(jsonMessage)
            .to.have.property('pinned')
            .to.be.equal(message.pinned);

        expect(jsonMessage)
            .to.have.property('title')
            .to.be.equal(message.title);

        expect(jsonMessage)
            .to.have.property('id')
            .to.be.equal(message.id.toString());
    });
});
