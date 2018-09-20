import CitySample from '../../../../src/application/domain/sample/CitySample';
import Address from '../../../../src/application/domain/hotspot/Address';
import { expect } from 'chai';

describe('Address value object', () => {
    it('Should have correct properties', () => {
        // Arrange
        const addressName = '12 rue des gobelins';
        // Act
        const address = new Address(addressName, CitySample.MARTIGNAS.name);
        // Assert
        expect(address).to.have.property('name');
        expect(address).to.have.property('city');
    });
});
