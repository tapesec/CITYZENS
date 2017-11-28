import HotspotFactory from '../../src/infrastructure/HotspotFactory';
import { expect } from 'chai';
describe('HotspotFactory', () => {

    it ('createFactory method should return a new hotspot', () => {
        // Arrange
        const fakeData = {

        };
        const hotspotFactory = new HotspotFactory();
        // Act
        const fakeNewHotspot = hotspotFactory.createHotspot(fakeData);
        // Assert
        expect(fakeNewHotspot).to.have.property('title');
    });
});
