import WallHotspotSample from '../../../src/domain/cityLife/model/sample/WallHotspotSample';
import CitySample from '../../../src/domain/cityLife/model/sample/CitySample';
import Hotspot from '../../../src/domain/cityLife/model/hotspot/Hotspot';
import PositionSample from '../../../src/domain/cityLife/model/sample/PositionSample';
import HotspotRepositoryInMemory from '../../../src/infrastructure/HotspotRepositoryInMemory';
import { expect } from 'chai';
import { v4 } from 'uuid';
import orm from '../../../src/infrastructure/orm';
import * as sinon from 'sinon';
import {
    CITYZEN_ELODIE,
    CITYZEN_LOUISE,
    CITYZEN_MARTIN,
    HOTSPOT_MARTIGNAS_CHURCH,
    HOTSPOT_MARTIGNAS_SCHOOL,
    HOTSPOT_MARTIGNAS_TOWNHALL,
} from '../../../src/infrastructure/dbInMemory';

describe('HotspotRepositoryInMemory', () => {
    let hotspotRepository: HotspotRepositoryInMemory;
    let fakeTownHall: any;
    let fakeChurch: any;
    let fakeSchool: any;
    let orm: any = {};
    let findStub: any;
    let findOneStub: any;
    let removeStub: any;
    let saveStub: any;

    beforeEach(() => {
        fakeTownHall = HOTSPOT_MARTIGNAS_TOWNHALL;
        fakeTownHall.cityzen = CITYZEN_ELODIE;
        fakeChurch = HOTSPOT_MARTIGNAS_CHURCH;
        fakeChurch.cityzen = CITYZEN_MARTIN;
        fakeSchool = HOTSPOT_MARTIGNAS_SCHOOL;
        fakeSchool.cityzen = CITYZEN_LOUISE;
        findStub = sinon.stub();
        findOneStub = sinon.stub();
        removeStub = sinon.stub();
        saveStub = sinon.stub();
        orm.hotspot = {
            findAll: findStub,
            findOne: findOneStub,
            save: saveStub,
            remove: removeStub,
        };
    });

    afterEach(() => {
        orm = {};
        hotspotRepository = null;
    });

    it.only('should find an hostpsot by id if id is provided (indeed)', () => {
        // Arrange
        findOneStub.returns(fakeSchool);
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        // Act
        const school = hotspotRepository.findById('362fd2aa-d838-4bc2-b088-7e27921c4780');
        // Expect
        expect(
            findOneStub.calledWith({ id: '362fd2aa-d838-4bc2-b088-7e27921c4780', removed: false }),
        ).to.be.true;
        expect(school).to.be.eql(WallHotspotSample.SCHOOL);
    });

    it.only("should find an hostpsot by slug if id's format is slug", () => {
        // Arrange
        findOneStub.returns(fakeSchool);
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        // Act
        const school = hotspotRepository.findById(WallHotspotSample.SCHOOL.slug);
        // Expect
        expect(findOneStub.calledWith({ slug: WallHotspotSample.SCHOOL.slug, removed: false })).to
            .be.true;
        expect(school).to.be.eql(WallHotspotSample.SCHOOL);
    });

    it('should return undefined if no hotspot found', () => {
        // Arrange
        findOneStub.returns(undefined);
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        // Act
        const nomatch = hotspotRepository.findById(v4());
        // Expect
        expect(nomatch).to.be.undefined;
    });

    it('should store a new hotspot in memory', () => {
        // Arrange
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        const wallHotspot = JSON.parse(JSON.stringify(WallHotspotSample.CHURCH));
        wallHotspot.removed = false;
        // Act
        hotspotRepository.store(WallHotspotSample.CHURCH);
        // Expect
        expect(saveStub.calledWith(wallHotspot)).to.be.true;
    });

    it('should remove an hotspot from memory', () => {
        // Arrange
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        // Act
        hotspotRepository.remove(WallHotspotSample.SCHOOL.id);
        // Expect
        expect(removeStub.calledWith(WallHotspotSample.SCHOOL.id)).to.be.true;
    });

    it('should retrieve hotspots spoted in the provided area', () => {
        // Arrange
        findStub.returns([fakeTownHall, fakeChurch, fakeSchool]);
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        const north: number = PositionSample.MARTIGNAS_NORTH_OUEST.latitude;
        const west: number = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
        const south: number = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
        const east: number = PositionSample.MARTIGNAS_SOUTH_EST.longitude;
        // Act
        const hotspots: Hotspot[] = hotspotRepository.findInArea(north, west, south, east);
        // Assert
        expect(
            findStub.calledWith({
                byArea: [north, west, south, east],
                removed: false,
            }),
        ).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(hotspots).to.have.lengthOf(3);
    });

    it("should'nt match hotspot in the specified area", () => {
        // Arrange
        findStub.returns([]);
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        // Act
        const hotspots: Hotspot[] = hotspotRepository.findInArea(
            PositionSample.MARTIGNAS_NORTH_OUEST.latitude,
            PositionSample.MARTIGNAS_NORTH_OUEST.longitude,
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Assert
        expect(hotspots).to.have.lengthOf(0);
        expect(hotspots).to.be.eql([]);
    });

    it('should retrieve hotspot by given city insee code', () => {
        // Arrange
        findStub.returns([fakeTownHall, fakeChurch, fakeSchool]);
        hotspotRepository = new HotspotRepositoryInMemory(orm);
        const insee = CitySample.MARTIGNAS.insee;
        // Act
        const hotspots: Hotspot[] = hotspotRepository.findByCodeCommune(insee);
        // Assert
        expect(hotspots).to.have.lengthOf(3);
    });
});
