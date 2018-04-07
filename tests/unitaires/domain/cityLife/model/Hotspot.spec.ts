import Hotspot, {
    HotspotScope,
    HotspotType,
    HotspotIconType,
} from '../../../../../src/domain/cityLife/model/hotspot/Hotspot';
import AddressSample from '../../../../../src/domain/cityLife/model/sample/AddressSample';
import PositionSample from '../../../../../src/domain/cityLife/model/sample/PositionSample';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';

import { expect } from 'chai';
import { v4 } from 'uuid';
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

        expect(jsonHotspot)
            .to.have.property('address')
            .to.have.property('city')
            .to.be.equal(hotspot.address.city);

        expect(jsonHotspot)
            .to.have.property('address')
            .to.have.property('name')
            .to.be.equal(hotspot.address.name);

        expect(jsonHotspot)
            .to.have.property('author')
            .to.have.property('id')
            .to.be.equal(hotspot.author.id.toString());

        expect(jsonHotspot)
            .to.have.property('author')
            .to.have.property('pseudo')
            .to.be.equal(hotspot.author.pseudo);

        expect(jsonHotspot)
            .to.have.property('avatarIconUrl')
            .to.be.equal(hotspot.avatarIconUrl.url);

        expect(jsonHotspot)
            .to.have.property('cityId')
            .to.be.equal(hotspot.cityId);

        expect(jsonHotspot)
            .to.have.property('iconType')
            .to.be.equal(hotspot.iconType);

        expect(jsonHotspot)
            .to.have.property('id')
            .to.be.equal(hotspot.id);

        expect(jsonHotspot)
            .to.have.property('members')
            .to.be.deep.equal(hotspot.members.toArray());

        expect(jsonHotspot)
            .to.have.property('position')
            .to.have.property('latitude')
            .to.be.equal(hotspot.position.latitude);

        expect(jsonHotspot)
            .to.have.property('position')
            .to.have.property('longitude')
            .to.be.equal(hotspot.position.longitude);

        expect(jsonHotspot)
            .to.have.property('scope')
            .to.be.equal(hotspot.scope);

        expect(jsonHotspot)
            .to.have.property('slug')
            .to.be.equal(hotspot.slug);

        expect(jsonHotspot)
            .to.have.property('title')
            .to.be.equal(hotspot.title);

        expect(jsonHotspot)
            .to.have.property('type')
            .to.be.equal(hotspot.type);

        expect(jsonHotspot)
            .to.have.property('views')
            .to.be.equal(hotspot.views);
    });
});
