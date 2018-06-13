import { expect } from 'chai';
import * as sinon from 'sinon';
import { v4 } from 'uuid';
import Hotspot from '../../../src/domain/cityLife/model/hotspot/Hotspot';
import CitySample from '../../../src/domain/cityLife/model/sample/CitySample';
import MediaHotspotSample from '../../../src/domain/cityLife/model/sample/MediaHotspotSample';
import PositionSample from '../../../src/domain/cityLife/model/sample/PositionSample';
import HotspotRepositoryInMemory from '../../../src/infrastructure/HotspotRepositoryInMemory';
import {
    CITYZEN_ELODIE,
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

    let postgreStub: sinon.SinonStub;
    let ormCityzen: any = {};

    beforeEach(() => {
        fakeTownHall = HOTSPOT_MARTIGNAS_TOWNHALL;
        fakeTownHall.cityzen = CITYZEN_ELODIE;
        fakeChurch = HOTSPOT_MARTIGNAS_CHURCH;
        fakeChurch.cityzen = CITYZEN_MARTIN;
        fakeSchool = HOTSPOT_MARTIGNAS_SCHOOL;
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
        ormCityzen = {
            getAllAuthors: sinon.stub(),
        };
        postgreStub = sinon.stub();
    });

    afterEach(() => {
        orm = {};
        hotspotRepository = null;
    });

    it('should find an hostpsot by id if id is provided (indeed)', async () => {
        // Arrange
        const hotspotToGet = MediaHotspotSample.SCHOOL;

        findOneStub.returns(fakeSchool);
        ormCityzen.getAllAuthors.returns(
            Promise.resolve([
                {
                    id: hotspotToGet.author.id.toString(),
                    pseudo: hotspotToGet.author.pseudo,
                    pictureCityzen: hotspotToGet.author.pictureCityzen.toString(),
                    pictureExtern: hotspotToGet.author.pictureExtern.toString(),
                },
            ]),
        );

        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        // Act
        const school = await hotspotRepository.findById(hotspotToGet.id);
        // Expect
        expect(findOneStub.calledWith({ id: hotspotToGet.id, removed: false })).to.be.true;
        expect(school).to.be.eql(hotspotToGet);
    });

    it("should find an hostpsot by slug if id's format is slug", async () => {
        const hotspotToGet = MediaHotspotSample.SCHOOL;

        // Arrange
        findOneStub.returns(fakeSchool);
        ormCityzen.getAllAuthors.returns(
            Promise.resolve([
                {
                    id: hotspotToGet.author.id.toString(),
                    pseudo: hotspotToGet.author.pseudo,
                    pictureCityzen: hotspotToGet.author.pictureCityzen.toString(),
                    pictureExtern: hotspotToGet.author.pictureExtern.toString(),
                },
            ]),
        );

        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        // Act
        const school = await hotspotRepository.findById(hotspotToGet.slug);
        // Expect
        expect(findOneStub.calledWith({ slug: hotspotToGet.slug, removed: false })).to.be.true;
        expect(school).to.be.eql(hotspotToGet);
    });

    it('should return undefined if no hotspot found', async () => {
        // Arrange
        findOneStub.returns(undefined);
        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        // Act
        const nomatch = await hotspotRepository.findById(v4());
        // Expect
        expect(nomatch).to.be.undefined;
    });

    it('should store a new hotspot in memory', () => {
        // Arrange
        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        const wallHotspot = JSON.parse(JSON.stringify(MediaHotspotSample.CHURCH));
        wallHotspot.removed = false;
        // Act
        hotspotRepository.store(MediaHotspotSample.CHURCH);
        // Expect
        expect(saveStub.calledWith(wallHotspot)).to.be.true;
    });

    it('should remove an hotspot from memory', () => {
        // Arrange
        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        // Act
        hotspotRepository.remove(MediaHotspotSample.SCHOOL.id);
        // Expect
        expect(removeStub.calledWith(MediaHotspotSample.SCHOOL.id)).to.be.true;
    });

    it('should retrieve hotspots spoted in the provided area', async () => {
        // Arrange
        findStub.returns([fakeTownHall, fakeChurch, fakeSchool]);
        ormCityzen.getAllAuthors.returns(
            Promise.resolve([
                { id: fakeTownHall.authorId, pseudo: 'fake' },
                { id: fakeChurch.authorId, pseudo: 'two' },
                { id: fakeSchool.authorId, pseudo: 'three' },
            ]),
        );
        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        const north: number = PositionSample.MARTIGNAS_NORTH_OUEST.latitude;
        const west: number = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
        const south: number = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
        const east: number = PositionSample.MARTIGNAS_SOUTH_EST.longitude;
        // Act
        const hotspots: Hotspot[] = await hotspotRepository.findInArea(north, west, south, east);
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

    it("should'nt match hotspot in the specified area", async () => {
        // Arrange
        findStub.returns([]);
        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        // Act
        const hotspots: Hotspot[] = await hotspotRepository.findInArea(
            PositionSample.MARTIGNAS_NORTH_OUEST.latitude,
            PositionSample.MARTIGNAS_NORTH_OUEST.longitude,
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Assert
        expect(hotspots).to.have.lengthOf(0);
        expect(hotspots).to.be.eql([]);
    });

    it('should retrieve hotspot by given city insee code', async () => {
        // Arrange
        findStub.returns([fakeTownHall, fakeChurch, fakeSchool]);
        ormCityzen.getAllAuthors.returns(
            Promise.resolve([
                { id: fakeTownHall.authorId, pseudo: 'fake' },
                { id: fakeChurch.authorId, pseudo: 'two' },
                { id: fakeSchool.authorId, pseudo: 'three' },
            ]),
        );
        hotspotRepository = new HotspotRepositoryInMemory(orm, ormCityzen as any);
        const insee = CitySample.MARTIGNAS.insee;
        // Act
        const hotspots: Hotspot[] = await hotspotRepository.findByCodeCommune(insee);
        // Assert
        expect(hotspots).to.have.lengthOf(3);
    });
});
