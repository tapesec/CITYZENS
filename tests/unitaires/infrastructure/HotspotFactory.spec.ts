import CityzenSample from '../../../src/domain/cityzens/model/CityzenSample';
import HotspotFactory from '../../../src/infrastructure/HotspotFactory';
import cityzenFromJwt from '../../../src/api/services/cityzen/cityzenFromJwt';
import CityzenId from './../../../src/domain/cityzens/model/CityzenId';
import { expect } from 'chai';
import { HotspotIconType, HotspotType } from '../../../src/domain/cityLife/model/hotspot/Hotspot';
import MemberList from '../../../src/domain/cityLife/model/hotspot/MemberList';
import Author from '../../../src/domain/cityLife/model/author/Author';

describe('HotspotFactory', () => {
    it('should build a WallHotspot with data provided from POST request', () => {
        // Arrange
        const fakeDataFromRequestPost: any = {
            title: 'new title',
            position: {
                latitude: 12.25632,
                longitude: 47.12345,
            },
            cityzen: CityzenSample.ELODIE.toJSON(),
            scope: 'private',
            address: {
                name: '4 rue Blanc',
                city: 'Martignas sur Jalles',
            },
            cityId: '34345',
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
        };
        const hotspotFactory = new HotspotFactory();
        // Act
        const fakeNewHotspot = hotspotFactory.build(fakeDataFromRequestPost);
        // Assert
        expect(fakeNewHotspot).to.have.property('id');
        expect(fakeNewHotspot)
            .to.have.property('title')
            .and.to.be.equal('new title');
        expect(fakeNewHotspot)
            .to.have.property('scope')
            .and.to.be.equal('private');
        commonHotspotPropertiesAssertion(fakeNewHotspot);
    });

    it('should build a WallHotspot with data from database', () => {
        // Arrange

        const fakeDataFromDatabase: any = {
            id: 'fake-id',
            title: 'new title',
            members: ['fake-member-id', 'fake-member-id2'],
            position: {
                latitude: 12.25632,
                longitude: 47.12345,
            },
            cityzen: CityzenSample.ELODIE.toJSON(),
            scope: 'private',
            address: {
                name: '4 rue Blanc',
                city: 'Martignas sur Jalles',
            },
            cityId: '34345',
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
        };
        const hotspotFactory = new HotspotFactory();
        // Act
        const fakeNewHotspot = hotspotFactory.build(fakeDataFromDatabase);
        // Assert
        expect(fakeNewHotspot)
            .to.have.property('id')
            .and.to.be.equal('fake-id');
        expect(fakeNewHotspot)
            .to.have.property('title')
            .and.to.be.equal('new title');
        expect(fakeNewHotspot)
            .to.have.property('scope')
            .and.to.be.equal('private');
        expect(fakeNewHotspot)
            .to.have.property('members')
            .and.to.deep.equal(
                new MemberList([new CityzenId('fake-member-id'), new CityzenId('fake-member-id2')]),
            );
        commonHotspotPropertiesAssertion(fakeNewHotspot);
    });
});

const commonHotspotPropertiesAssertion = (fakeNewHotspot: any): void => {
    expect(fakeNewHotspot)
        .to.have.property('cityId')
        .and.to.be.equal('34345');
    expect(fakeNewHotspot)
        .to.have.property('position')
        .to.have.property('latitude')
        .to.be.equal(12.25632);
    expect(fakeNewHotspot)
        .to.have.property('position')
        .to.have.property('longitude')
        .to.be.equal(47.12345);
    expect(fakeNewHotspot)
        .to.have.property('author')
        .to.have.property('pseudo')
        .to.be.equal('Princesse');
    expect(fakeNewHotspot)
        .to.have.property('author')
        .to.have.property('id')
        .to.be.deep.equal(CityzenSample.ELODIE.id);
    expect(fakeNewHotspot)
        .to.have.property('position')
        .to.have.property('longitude')
        .to.be.equal(47.12345);
    expect(fakeNewHotspot)
        .to.have.property('address')
        .to.have.property('name')
        .to.be.equal('4 rue Blanc');
    expect(fakeNewHotspot)
        .to.have.property('address')
        .to.have.property('city')
        .to.be.equal('Martignas sur Jalles');
    expect(fakeNewHotspot)
        .to.have.property('type')
        .to.be.equal(HotspotType.WallMessage);
    expect(fakeNewHotspot)
        .to.have.property('iconType')
        .to.be.equal(HotspotIconType.Wall);
};
