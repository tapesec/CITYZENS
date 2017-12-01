import Message from '../../../../../src/domain/cityLife/model/messages/Message';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';
import { v4 } from 'uuid';
import { expect } from 'chai';

describe('Message entity', () => {

    it ('should have correct properties', () => {
        // Arrange
        const id = v4();
        const title = 'a fake title';
        const author = AuthorSample.ELODIE;
        const pinned = true;
        const createdAt = new Date();
        const updatedAt = new Date();
        // Act
        const newMessage = new Message(id, title, author, pinned, createdAt, new Date());
        // Assert
        expect(newMessage).to.have.property('title').to.equal(title);
        expect(newMessage).to.have.property('id').to.equal(id);
        expect(newMessage).to.have.property('author').to.equal(AuthorSample.ELODIE);
        expect(newMessage).to.have.property('createdAt').to.eql(createdAt);
        expect(newMessage).to.have.property('updatedAt').to.eql(updatedAt);
        expect(newMessage).to.have.property('pinned').to.equal(true);
    });
});
