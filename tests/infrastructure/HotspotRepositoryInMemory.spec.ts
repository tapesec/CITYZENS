import HotspotSample from '../../src/domain/cityLife/model/HotspotSample';
import Hotspot from '../../src/domain/cityLife/model/Hotspot';
import PositionSample from '../../src/domain/cityLife/model/PositionSample';
import {
    HotspotRepositoryInMemory,
} from '../../src/infrastructure/HotspotRepositoryInMemory';
import { expect } from 'chai';
import { v4 } from 'uuid';

describe('HotspotRepositoryInMemory', () => {

    let hotspotRepository : HotspotRepositoryInMemory;

    beforeEach(() => {
        hotspotRepository = new HotspotRepositoryInMemory();
        hotspotRepository.store(HotspotSample.SCHOOL);
        hotspotRepository.store(HotspotSample.TOWNHALL);
        hotspotRepository.store(HotspotSample.MERIGNAC);
    });

    afterEach(() => {
        hotspotRepository = null;
    });

    it('should find an hostpsot by id', () => {
        // Act
        const school = hotspotRepository.findById(HotspotSample.SCHOOL.id);
        // Expect
        expect(school).to.be.equal(HotspotSample.SCHOOL);
    });

    it('should return undefined if no hotspot found', () => {
        // Act
        const nomatch = hotspotRepository.findById(v4());
        // Expect
        expect(nomatch).to.be.undefined;
    });

    it('should store a new hotspot in memory', () => {
        // Arrange
        hotspotRepository = new HotspotRepositoryInMemory​​();
        // Act
        hotspotRepository.store(HotspotSample.CHURCH);
        // Arrange
        const church = hotspotRepository.findById(HotspotSample.CHURCH.id);
        // Expect
        expect(church).to.be.equal(HotspotSample.CHURCH);
    });

    it('should remove an hotspot from memory', () => {
        // Act
        hotspotRepository.remove(HotspotSample.SCHOOL);
        // Arrange
        const nomatch = hotspotRepository.findById(HotspotSample.SCHOOL.id);
        // Expect
        expect(nomatch).to.be.undefined;
    });

    it('should retrieve hotspots spoted in the provided area', () => {
        // Act
        const hotspots : Hotspot[] = hotspotRepository.findInArea(
            PositionSample.MARTIGNAS_NORTH_OUEST.latitude,
            PositionSample.MARTIGNAS_NORTH_OUEST.longitude,
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Expect
        expect(hotspots).to.have.lengthOf(2);
    });

    it('should\'nt match hotspot in the specified area', () => {
        // Arrange
        hotspotRepository.remove(HotspotSample.SCHOOL);
        hotspotRepository.remove(HotspotSample.TOWNHALL);
        // Act
        const hotspots : Hotspot[] = hotspotRepository.findInArea(
            PositionSample.MARTIGNAS_NORTH_OUEST.latitude,
            PositionSample.MARTIGNAS_NORTH_OUEST.longitude,
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Expect
        expect(hotspots).to.have.lengthOf(0);
        expect(hotspots).to.be.eql([]);
    });
});
