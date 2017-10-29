import Cityzen from '../../../../src/domain/cityzens/model/Cityzen';
import { expect } from 'chai';

describe('Cityzens entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const email : string = 'mail@mailbox.com';
        const pseudo : string = 'kenny';
        // Act
        const kenny : Cityzen = new Cityzen(email, pseudo);
        // Arrange
        expect(kenny.email).to.be.equal(email);
        expect(kenny.pseudo).to.be.equal(pseudo);
    });
});
