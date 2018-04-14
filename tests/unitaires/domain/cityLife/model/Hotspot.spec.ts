import { use, expect } from 'chai';
import { v4 } from 'uuid';
use(require('chai-shallow-deep-equal'));
import config from './../../../../../src/api/config';
import Hotspot, {
    HotspotScope,
    HotspotType,
    HotspotIconType,
} from '../../../../../src/domain/cityLife/model/hotspot/Hotspot';
import AddressSample from '../../../../../src/domain/cityLife/model/sample/AddressSample';
import PositionSample from '../../../../../src/domain/cityLife/model/sample/PositionSample';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';
import MediaHotspot from '../../../../../src/domain/cityLife/model/hotspot/MediaHotspot';
import HotspotBuilder from '../../../../../src/domain/cityLife/factories/HotspotBuilder';
import CityId from '../../../../../src/domain/cityLife/model/city/CityId';
import MediaBuilder from '../../../../../src/domain/cityLife/factories/MediaBuilder';
import HotspotId from '../../../../../src/domain/cityLife/model/hotspot/HotspotId';
import HotspotTitle from '../../../../../src/domain/cityLife/model/hotspot/HotspotTitle';
import ViewsCount from '../../../../../src/domain/cityLife/model/hotspot/ViewsCount';
import WallHotspot from '../../../../../src/domain/cityLife/model/hotspot/WallHotspot';
import HotspotSlug from '../../../../../src/domain/cityLife/model/hotspot/HotspotSlug';
import CityzenId from '../../../../../src/domain/cityzens/model/CityzenId';
import MemberList from '../../../../../src/domain/cityLife/model/hotspot/MemberList';
import WallHotspotSample from '../../../../../src/domain/cityLife/model/sample/WallHotspotSample';
import AlertHotspotSample from '../../../../../src/domain/cityLife/model/sample/AlertHotspotSample';
import EventHotspotSample from '../../../../../src/domain/cityLife/model/sample/EventHotspotSample';

const slug = require('slug');

describe('WallHotspot entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        // Act
        const hotspot: WallHotspot = new WallHotspot(
            new HotspotBuilder(
                new HotspotId(id),
                PositionSample.MARTIGNAS_NORTH_OUEST,
                AuthorSample.LOUISE,
                new CityId('33273'),
                AddressSample.TOWNHALL_ADDRESS,
                new ViewsCount(0),
                HotspotType.WallMessage,
                HotspotIconType.Wall,
            ),
            new MediaBuilder(
                new HotspotTitle(title),
                new HotspotSlug(slug(title)),
                HotspotScope.Public,
                new MemberList([new CityzenId('fake-id1'), new CityzenId('fake-id2')]),
            ),
        );
        // Assert
        expect(hotspot.id).to.be.equal(id);
        expect(hotspot.position).to.be.equal(PositionSample.MARTIGNAS_NORTH_OUEST);
        expect(hotspot.title).to.be.equal(title);
        expect(hotspot.slug).to.be.equal(slug(title));
        expect(hotspot.author).to.be.equal(AuthorSample.LOUISE);
        expect(hotspot.type).to.be.equal(HotspotType.WallMessage);
        expect(hotspot.members.toArray()).to.deep.equal([
            new CityzenId('fake-id1'),
            new CityzenId('fake-id2'),
        ]);
    });

    it('Should return a stringified members as array when hotspot toJson() called', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        // Act
        const hotspot: WallHotspot = new WallHotspot(
            new HotspotBuilder(
                new HotspotId(id),
                PositionSample.MARTIGNAS_NORTH_OUEST,
                AuthorSample.LOUISE,
                new CityId('33273'),
                AddressSample.TOWNHALL_ADDRESS,
                new ViewsCount(0),
                HotspotType.WallMessage,
                HotspotIconType.Wall,
            ),
            new MediaBuilder(
                new HotspotTitle(title),
                new HotspotSlug(slug(title)),
                HotspotScope.Public,
                new MemberList([new CityzenId('fake-id1'), new CityzenId('fake-id2')]),
            ),
        );

        expect(JSON.stringify(hotspot)).to.match(/"members":\["fake-id1","fake-id2"\]/);
    });

    it('Should move to new position', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        // Act
        const hotspot: WallHotspot = new WallHotspot(
            new HotspotBuilder(
                new HotspotId(id),
                PositionSample.MARTIGNAS_NORTH_OUEST,
                AuthorSample.LOUISE,
                new CityId('33273'),
                AddressSample.TOWNHALL_ADDRESS,
                new ViewsCount(0),
                HotspotType.WallMessage,
                HotspotIconType.Wall,
            ),
            new MediaBuilder(
                new HotspotTitle(title),
                new HotspotSlug(slug(title)),
                HotspotScope.Public,
                new MemberList(),
            ),
        );
        // Act
        hotspot.moveTo(
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Assert
        expect(hotspot.position).to.be.eql(PositionSample.MARTIGNAS_SOUTH_EST);
    });

    it('should change title', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        const newTitle: string = 'New Mairie';
        // Act
        const hotspot: WallHotspot = new WallHotspot(
            new HotspotBuilder(
                new HotspotId(id),
                PositionSample.MARTIGNAS_NORTH_OUEST,
                AuthorSample.LOUISE,
                new CityId('33273'),
                AddressSample.TOWNHALL_ADDRESS,
                new ViewsCount(0),
                HotspotType.WallMessage,
                HotspotIconType.Wall,
            ),
            new MediaBuilder(
                new HotspotTitle(title),
                new HotspotSlug(slug(title)),
                HotspotScope.Public,
                new MemberList(),
            ),
        );
        // Act
        hotspot.changeTitle(newTitle);
        // assert
        expect(hotspot.title).to.be.equal(newTitle);
        expect(hotspot.slug).to.be.equal(slug(newTitle));
    });

    it('should change address', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        const newAddress = 'New address';
        // Act
        const hotspot: WallHotspot = new WallHotspot(
            new HotspotBuilder(
                new HotspotId(id),
                PositionSample.MARTIGNAS_NORTH_OUEST,
                AuthorSample.LOUISE,
                new CityId('33273'),
                AddressSample.TOWNHALL_ADDRESS,
                new ViewsCount(0),
                HotspotType.WallMessage,
                HotspotIconType.Wall,
            ),
            new MediaBuilder(
                new HotspotTitle(title),
                new HotspotSlug(slug(title)),
                HotspotScope.Public,
                new MemberList(),
            ),
        );
        // Act
        hotspot.changeAddress(newAddress);
        // assert
        expect(hotspot.address.name).to.be.equal(newAddress);
    });

    it('should change scope', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        const newScope = HotspotScope.Private;
        // Act
        const hotspot: WallHotspot = new WallHotspot(
            new HotspotBuilder(
                new HotspotId(id),
                PositionSample.MARTIGNAS_NORTH_OUEST,
                AuthorSample.LOUISE,
                new CityId('33273'),
                AddressSample.TOWNHALL_ADDRESS,
                new ViewsCount(0),
                HotspotType.WallMessage,
                HotspotIconType.Wall,
            ),
            new MediaBuilder(
                new HotspotTitle(title),
                new HotspotSlug(slug(title)),
                HotspotScope.Public,
                new MemberList(),
            ),
        );
        // Act
        hotspot.changeScope(newScope);
        // assert
        expect(hotspot.scope).to.be.equal(newScope);
    });

    it('Should parse and stringify correctly WallHotspot.', () => {
        const hotspot = WallHotspotSample.SCHOOL;
        const jsonHotspot = JSON.parse(JSON.stringify(hotspot));
        expect(jsonHotspot).to.shallowDeepEqual({
            id: 'c28e94ef-ad1d-4260-8452-89a2b7bf298e',
            position: { latitude: 44.84665782, longitude: -0.76560438 },
            author: { pseudo: 'Louisounette', id: 'auth0|fake-id2' },
            cityId: '33273',
            address: { name: '4 rue Louis Blanc', city: 'Martignas-sur-Jalle' },
            views: 1,
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
            scope: HotspotScope.Public,
            title: 'Ecole Flora Tristan',
            slug: 'Ecole-Flora-Tristan',
            members: [],
            avatarIconUrl: config.avatarIcon.defaultWallIcon,
        });
    });

    it('should stringify and parse correctly an AlertHotspot', () => {
        const hotspot = AlertHotspotSample.TO_READ_ALERT_HOTSPOT_FOR_TU;
        const jsonHotspot = JSON.parse(JSON.stringify(hotspot));
        expect(jsonHotspot).to.shallowDeepEqual({
            id: 'd0568142-23f4-427d-83f3-e84443cc3643',
            position: { latitude: 44.841633, longitude: -0.776771 },
            author: { pseudo: 'lucabrx', id: 'auth0|5a1e6928f96aa12d71333e0e' },
            cityId: '33273',
            address: { name: '6 avenue de Verdin', city: 'Martignas-sur-Jalle' },
            views: 1,
            type: HotspotType.Alert,
            iconType: HotspotIconType.Accident,
            imageDescriptionLocation: 'https://cdn.filestackcontent.com/XMLTLsrBQY2uwNWpAIq1',
            message: {
                content:
                    'Un accident est survenue entre un 4x4 et une smart, des debris son encore présent.',
            },
            voterList: [['Karadoc', true], ['Perceval', false]],
            pertinence: { agree: 58420, disagree: 1754 },
        });
    });

    it('should stringify and parse correctly an EventHotspot', () => {
        const hotspot = EventHotspotSample.TO_READ_EVENT_HOTSPOT_FOR_TEST;
        const jsonHotspot = JSON.parse(JSON.stringify(hotspot));
        expect(jsonHotspot).to.shallowDeepEqual({
            id: '19eab732-1a3f-4bfb-abb0-1d0dde8a3669',
            position: { latitude: 44.84181, longitude: -0.64759 },
            author: { pseudo: 'Princesse', id: 'auth0|fake-id3' },
            cityId: '33281',
            address: { name: "12 rue de l'Aubépine", city: 'Merignac' },
            views: 1,
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
            scope: HotspotScope.Private,
            title: 'Docteur Maboul',
            slug: 'Docteur-Maboul',
            members: ['auth0|fake-id3', 'auth0|fake-id2'],
            avatarIconUrl: config.avatarIcon.defaultWallIcon,
            description: {
                content:
                    'Un matche va se dérouler entre Oberyn et La Montagne pour décider du destin de tyrion',
            },
        });
    });
});
