import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import { v4 } from 'uuid';
import CityId from '../../../src/domain/cityLife/model/city/CityId';
import Hotspot from '../../../src/domain/cityLife/model/hotspot/Hotspot';
import HotspotId from '../../../src/domain/cityLife/model/hotspot/HotspotId';
import CitySample from '../../../src/domain/cityLife/model/sample/CitySample';
import MediaHotspotSample from '../../../src/domain/cityLife/model/sample/MediaHotspotSample';
import PositionSample from '../../../src/domain/cityLife/model/sample/PositionSample';
import {
    CITYZEN_ELODIE,
    CITYZEN_MARTIN,
    HOTSPOT_MARTIGNAS_CHURCH,
    HOTSPOT_MARTIGNAS_SCHOOL,
    HOTSPOT_MARTIGNAS_TOWNHALL,
} from '../../../src/infrastructure/dbInMemory';
import HotspotFactory from '../../../src/infrastructure/HotspotFactory';
import HotspotRepositoryPostgreSQL from '../../../src/infrastructure/HotspotRepositoryPostgreSQL';
import OrmHotspot from '../../../src/infrastructure/ormHotspot';

describe('HotspotRepositoryInMemory', () => {
    let hotspotRepository: HotspotRepositoryPostgreSQL;
    let fakeTownHall: any;
    let fakeChurch: any;
    let fakeSchool: any;

    let orm: TypeMoq.IMock<OrmHotspot>;
    let factory: TypeMoq.IMock<HotspotFactory>;

    beforeEach(() => {
        fakeTownHall = HOTSPOT_MARTIGNAS_TOWNHALL;
        fakeTownHall.cityzen = CITYZEN_ELODIE;
        fakeChurch = HOTSPOT_MARTIGNAS_CHURCH;
        fakeChurch.cityzen = CITYZEN_MARTIN;
        fakeSchool = HOTSPOT_MARTIGNAS_SCHOOL;

        orm = TypeMoq.Mock.ofType<OrmHotspot>();
        factory = TypeMoq.Mock.ofType();
    });

    afterEach(() => {
        hotspotRepository = null;
    });

    it('should find an hostpsot by id if id is provided (indeed)', async () => {
        // Arrange
        const hotspotToGet = MediaHotspotSample.SCHOOL;
        const hotspot: any = '';

        orm.setup(x => x.findOne(hotspotToGet.id)).returns(() => Promise.resolve(hotspot));
        factory.setup(x => x.build(hotspot)).returns(() => hotspotToGet);

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);
        // Act
        const school = await hotspotRepository.findById(hotspotToGet.id);
        // Expect
        orm.verify(x => x.findOne(hotspotToGet.id), TypeMoq.Times.once());
        expect(school).to.be.eql(hotspotToGet);
    });

    it('should return undefined if no hotspot found', async () => {
        const hotspotId = new HotspotId(v4());

        orm.setup(x => x.findOne(hotspotId)).returns(() => Promise.resolve(undefined));

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);
        // Act
        const nomatch = await hotspotRepository.findById(hotspotId);
        // Expect
        expect(nomatch).to.be.undefined;
    });

    it('should store a new hotspot in memory', async () => {
        orm.setup(x => x.save(MediaHotspotSample.CHURCH)).returns(() => Promise.resolve());

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);
        const wallHotspot = JSON.parse(JSON.stringify(MediaHotspotSample.CHURCH));
        wallHotspot.removed = false;
        // Act
        await hotspotRepository.store(MediaHotspotSample.CHURCH);
        // Expect
        orm.verify(x => x.save(MediaHotspotSample.CHURCH), TypeMoq.Times.once());
    });

    it('should remove an hotspot from memory', async () => {
        orm.setup(x => x.delete(MediaHotspotSample.SCHOOL.id)).returns(() => Promise.resolve());

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);
        // Act
        await hotspotRepository.remove(MediaHotspotSample.SCHOOL.id);
        // Expect
        orm.verify(x => x.delete(MediaHotspotSample.SCHOOL.id), TypeMoq.Times.once());
    });

    it('should retrieve hotspots spoted in the provided area', async () => {
        // Arrange
        const north: number = PositionSample.MARTIGNAS_NORTH_OUEST.latitude;
        const west: number = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
        const south: number = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
        const east: number = PositionSample.MARTIGNAS_SOUTH_EST.longitude;

        const hotspotArray = ['0', '1', '2'];

        orm
            .setup(x => x.findByArea(north, west, south, east))
            .returns(() => Promise.resolve(hotspotArray));
        factory
            .setup(x => x.build(TypeMoq.It.isAny()))
            .returns(() => MediaHotspotSample.MATCH_EVENT);

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);

        // Act
        const hotspots: Hotspot[] = await hotspotRepository.findInArea(north, west, south, east);
        // Assert

        orm.verify(x => x.findByArea(north, west, south, east), TypeMoq.Times.once());
        factory.verify(
            x => x.build(TypeMoq.It.isAny()),
            TypeMoq.Times.exactly(hotspotArray.length),
        );
        expect(hotspots).to.have.lengthOf(3);
    });

    it("should'nt match hotspot in the specified area", async () => {
        // Arrange
        const north: number = PositionSample.MARTIGNAS_NORTH_OUEST.latitude;
        const west: number = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
        const south: number = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
        const east: number = PositionSample.MARTIGNAS_SOUTH_EST.longitude;

        const hotspotArray = [];

        orm
            .setup(x => x.findByArea(north, west, south, east))
            .returns(() => Promise.resolve(hotspotArray));
        factory
            .setup(x => x.build(TypeMoq.It.isAny()))
            .returns(() => MediaHotspotSample.MATCH_EVENT);

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);

        // Act
        const hotspots: Hotspot[] = await hotspotRepository.findInArea(north, west, south, east);
        // Assert

        orm.verify(x => x.findByArea(north, west, south, east), TypeMoq.Times.once());
        factory.verify(
            x => x.build(TypeMoq.It.isAny()),
            TypeMoq.Times.exactly(hotspotArray.length),
        );
        expect(hotspots).to.have.lengthOf(0);
    });

    it('should retrieve hotspot by given city insee code', async () => {
        const cityId = new CityId(CitySample.MARTIGNAS.insee);

        orm
            .setup(x => x.findByCity(cityId))
            .returns(() => Promise.resolve([fakeTownHall, fakeChurch, fakeSchool]));
        factory
            .setup(x => x.build(TypeMoq.It.isAny()))
            .returns(() => MediaHotspotSample.MATCH_EVENT);

        hotspotRepository = new HotspotRepositoryPostgreSQL(orm.object, factory.object);
        const insee = CitySample.MARTIGNAS.insee;
        // Act
        const hotspots: Hotspot[] = await hotspotRepository.findByCodeCommune(cityId);
        // Assert
        expect(hotspots).to.have.lengthOf(3);
    });
});
