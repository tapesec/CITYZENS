import CitySample from '../../src/domain/cityLife/model/sample/CitySample';
import HotspotSample from '../../src/domain/cityLife/model/sample/HotspotSample';
import Hotspot from '../../src/domain/cityLife/model/hotspot/Hotspot';
import PositionSample from '../../src/domain/cityLife/model/sample/PositionSample';
import {
    HotspotRepositoryInMemory,
} from '../../src/infrastructure/HotspotRepositoryInMemory';
import { expect } from 'chai';
import { v4 } from 'uuid';
import orm from './../../src/infrastructure/orm';
import * as TypeMoq from 'typemoq';
import {
    HOTSPOT_MARTIGNAS_TOWNHALL,
    HOTSPOT_MARTIGNAS_CHURCH,
    HOTSPOT_MARTIGNAS_SCHOOL,
    CITYZEN_ELODIE,
    CITYZEN_LOUISE,
} from './../../src/infrastructure/dbInMemory';

describe('HotspotRepositoryInMemory', () => {

    let hotspotRepository : HotspotRepositoryInMemory;
    let orm : TypeMoq.IMock<any>;
    let fakeTownHall : any;
    let fakeChurch : any;
    let fakeSchool : any;

    beforeEach(() => {
        fakeTownHall = HOTSPOT_MARTIGNAS_TOWNHALL;
        fakeTownHall.cityzen = CITYZEN_ELODIE;
        fakeChurch = HOTSPOT_MARTIGNAS_CHURCH;
        fakeChurch.cityzen = CITYZEN_ELODIE;
        fakeSchool = HOTSPOT_MARTIGNAS_SCHOOL;
        fakeSchool.cityzen = CITYZEN_LOUISE;
        orm = TypeMoq.Mock.ofType();
    });

    afterEach(() => {
        orm = undefined;
        hotspotRepository = null;
    });

    it('should find an hostpsot by id', () => {
        // Arrange
        const fakeHotspotOrm = {
            findOne: () => fakeSchool,
        };
        orm
        .setup((x : any) => x.hotspot)
        .returns(() => fakeHotspotOrm);
        hotspotRepository = new HotspotRepositoryInMemory(orm.object);
        // Act
        const school = hotspotRepository.findById(HotspotSample.SCHOOL.id);
        // Expect
        expect(school).to.be.equal(HotspotSample.SCHOOL);
    });

    it('should return undefined if no hotspot found', () => {
        // Arrange
        const fakeHotspotOrm = {
            findOne: () : any => undefined,
        };
        orm
        .setup((x : any) => x.hotspot)
        .returns(() => fakeHotspotOrm);
        hotspotRepository = new HotspotRepositoryInMemory(orm.object);
        // Act
        const nomatch = hotspotRepository.findById(v4());
        // Expect
        expect(nomatch).to.be.undefined;
    });

    it('should store a new hotspot in memory', () => {
        // Arrange
        hotspotRepository = new HotspotRepositoryInMemory​​(orm);
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
        // Arrange
        const fakeHotspotOrm = {
            findAll: () => [fakeTownHall, fakeChurch, fakeSchool],
        };
        orm
        .setup((x : any) => x.hotspot)
        .returns(() => fakeHotspotOrm);
        hotspotRepository = new HotspotRepositoryInMemory(orm.object);
        // Act
        const hotspots : Hotspot[] = hotspotRepository.findInArea(
            PositionSample.MARTIGNAS_NORTH_OUEST.latitude,
            PositionSample.MARTIGNAS_NORTH_OUEST.longitude,
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Assert
        expect(hotspots).to.have.lengthOf(3);
    });

    it('should\'nt match hotspot in the specified area', () => {
        // Arrange
        const emptyArray : any = [];
        const mockedFindAll = {
            findAll: () => emptyArray,
        };
        orm
        .setup((x : any) => x.hotspot)
        .returns(() =>  mockedFindAll);
        hotspotRepository = new HotspotRepositoryInMemory(orm.object);
        // Act
        const hotspots : Hotspot[] = hotspotRepository.findInArea(
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
        const fakeHotspotOrm = {
            findAll: () => [fakeTownHall, fakeChurch, fakeSchool],
        };
        orm
        .setup((x : any) => x.hotspot)
        .returns(() => fakeHotspotOrm);
        hotspotRepository = new HotspotRepositoryInMemory(orm.object);
        const insee = CitySample.MARTIGNAS.insee;
        // Act
        const hotspots : Hotspot[] = hotspotRepository.findByCodeCommune(insee);
        // Assert
        expect(hotspots).to.have.lengthOf(3);
    });
});
