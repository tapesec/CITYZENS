import CityzenSample from '../../../src/domain/cityzens/model/CityzenSample';
import HotspotFactory from '../../../src/infrastructure/HotspotFactory';
import cityzenFromJwt from '../../../src/api/services/cityzen/cityzenFromJwt';
import CityzenId from './../../../src/domain/cityzens/model/CityzenId';
import { expect } from 'chai';
import {
    HotspotIconType,
    HotspotType,
    HotspotScope,
} from '../../../src/domain/cityLife/model/hotspot/Hotspot';
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

        commonHotspotPropertiesAssertion(fakeNewHotspot, {
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
            scope: HotspotScope.Private,
        });
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
            scope: HotspotScope.Private,
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
            .to.have.property('members')
            .and.to.deep.equal(
                new MemberList([new CityzenId('fake-member-id'), new CityzenId('fake-member-id2')]),
            );
        commonHotspotPropertiesAssertion(fakeNewHotspot, {
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
            id: 'fake-id',
            title: 'new title',
            scope: HotspotScope.Private,
        });
    });

    it.only('should build an alertHotspot with data from database', () => {
        // Arrange

        const fakeDataFromDatabase: any = {
            id: '2633cf57-15a0-4d67-818b-eb25bf734c8f',
            position: {
                latitude: 12.25632,
                longitude: 47.12345,
            },
            cityzen: CityzenSample.ELODIE.toJSON(),
            address: {
                name: '4 rue Blanc',
                city: 'Martignas sur Jalles',
            },
            cityId: '34345',
            type: HotspotType.Alert,
            iconType: HotspotIconType.Accident,
            voterList: [['auth0|1jks2kdz2dqziq', true]],
            message: {
                content: 'a fake content for test purpose',
                updatedAt: '2018-04-09T04:36:54.450Z',
            },
        };
        const hotspotFactory = new HotspotFactory();
        // Act
        const fakeNewHotspot = hotspotFactory.build(fakeDataFromDatabase);
        // Assert
        commonHotspotPropertiesAssertion(fakeNewHotspot, {
            iconType: HotspotIconType.Accident,
            type: HotspotType.Alert,
            id: '2633cf57-15a0-4d67-818b-eb25bf734c8f',
            voterList: ['auth0|1jks2kdz2dqziq', true],
        });
    });
});

const commonHotspotPropertiesAssertion = (fakeNewHotspot: any, specificProperties): void => {
    if (specificProperties.id !== undefined) {
        expect(fakeNewHotspot)
            .to.have.property('id')
            .and.to.be.equal(specificProperties.id);
    }
    if (specificProperties.title !== undefined) {
        expect(fakeNewHotspot)
            .to.have.property('title')
            .and.to.be.equal(specificProperties.title);
    }
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
    if (specificProperties.voterList !== undefined) {
        expect(fakeNewHotspot.voterList.has(new CityzenId(specificProperties.voterList[0]))).to.be
            .true;
        expect(fakeNewHotspot).to.have.property('voterList');
    }
    if (specificProperties.scope !== undefined) {
        expect(fakeNewHotspot)
            .to.have.property('scope')
            .and.to.be.equal(specificProperties.scope);
    }
    if (specificProperties.type !== undefined) {
        expect(fakeNewHotspot)
            .to.have.property('type')
            .to.be.equal(specificProperties.type);
    }
    if (specificProperties.iconType !== undefined) {
        expect(fakeNewHotspot)
            .to.have.property('iconType')
            .to.be.equal(specificProperties.iconType);
    }
};
