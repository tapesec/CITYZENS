import Position from '../../../../src/domain/hotspot/Position';
import { expect } from 'chai';

describe('Position value object', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const lat: number = 44.84032108;
        const lng: number = -0.77510476;
        // Act
        const position: Position = new Position(lat, lng);
        // Assert
        expect(position.latitude).to.be.equal(lat);
        expect(position.longitude).to.be.equal(lng);
    });
});
