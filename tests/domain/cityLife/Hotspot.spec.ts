import { expect } from 'chai';
import { v4 } from 'uuid';

import Hotspot from '../../../src/domain/cityLife/Hotspot';
import PositionSample from '../../../src/domain/cityLife/PositionSample';

describe('Hotspot entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const id: string = v4();
        // Act
        const hotspot: Hotspot = new Hotspot(id, PositionSample.MARTIGNAS_NORTH_OUEST);
        // Assert
        expect(hotspot.id).to.be.equal(id);
        expect(hotspot.position).to.be.equal(PositionSample.MARTIGNAS_NORTH_OUEST);
    });
});
