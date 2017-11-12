import Cityzen from '../../../../src/domain/cityzens/model/Cityzen';
import { expect } from 'chai';

describe('Cityzens entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const email : string = 'mail@mailbox.com';
        const pseudo : string = 'kenny';
        const description : string = 'fake description';
        // Act
        const kenny : Cityzen = new Cityzen(email, pseudo, description);
        // Arrange
        expect(kenny.email).to.be.equal(email);
        expect(kenny.pseudo).to.be.equal(pseudo);
        expect(kenny.description).to.be.equal(description);
    });

    it('Should edit his description', () => {
        // Arrange
        const email : string = 'mail@mailbox.com';
        const pseudo : string = 'kenny';
        const description : string = 'fake description';
        const newDescription : string = 'new fake description';
        // Act
        const kenny : Cityzen = new Cityzen(email, pseudo, description);
        kenny.editDescription(newDescription);
        // Assert
        expect(kenny.description).to.be.equal(newDescription);
    });
});
