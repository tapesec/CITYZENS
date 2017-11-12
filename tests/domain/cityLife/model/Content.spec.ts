import Content from '../../../../src/domain/cityLife/model/hotspot/Content';
import { expect } from 'chai';

describe('Content value object', () => {

    it('Should have correct properties set by constructor', () => {
        // Arrange
        const message : string = 'Bientôt ouvert';
        const createdAt : Date = new Date();
        const updatedAt : Date = new Date();
        // Act
        const content : Content = new Content(message, createdAt, updatedAt);
        // Assert
        expect(content.message).to.be.equal(message);
        expect(content.createdAt).to.be.equal(createdAt);
        expect(content.updatedAt).to.be.equal(updatedAt);
    });
});
