import HotspotId from '../../../../src/domain/cityLife/model/hotspot/HotspotId';
import HotspotSlug from '../../../../src/domain/cityLife/model/hotspot/HotspotSlug';
import HotspotTitle from '../../../../src/domain/cityLife/model/hotspot/HotspotTitle';
import MemberList from '../../../../src/domain/cityLife/model/hotspot/MemberList';
import Position from '../../../../src/domain/cityLife/model/hotspot/Position';
import ViewsCount from '../../../../src/domain/cityLife/model/hotspot/ViewsCount';
import Address from '../../../../src/domain/cityLife/model/hotspot/Address';
import CityId from '../../../../src/domain/cityLife/model/city/CityId';
import Author from '../../../../src/domain/cityLife/model/author/Author';
import ImageLocation from '../../../../src/domain/cityLife/model/hotspot/ImageLocation';

import * as Chai from 'chai';
import CityzenId from '../../../../src/domain/cityzens/model/CityzenId';
import SlideShow from '../../../../src/domain/cityLife/model/hotspot/SlideShow';

describe('ValueObject', () => {
    describe('Equalities checks', () => {
        it('hotspotId', () => {
            const hotspotId = new HotspotId('idid');
            const hotspotId2 = new HotspotId('id2id2');

            Chai.expect(hotspotId.isEqual(hotspotId)).to.be.true;
            Chai.expect(hotspotId.isEqual(hotspotId2)).to.be.false;
        });

        it('hotspotSlug', () => {
            const hotspotSlug = new HotspotSlug('slugslug');
            const hotspotSlug2 = new HotspotSlug('slug2slug2');

            Chai.expect(hotspotSlug.isEqual(hotspotSlug)).to.be.true;
            Chai.expect(hotspotSlug.isEqual(hotspotSlug2)).to.be.false;
        });

        it('hotspotTitle', () => {
            const hotspotTitle = new HotspotTitle('titletitle');
            const hotspotTitle2 = new HotspotTitle('title2title2');

            Chai.expect(hotspotTitle.isEqual(hotspotTitle)).to.be.true;
            Chai.expect(hotspotTitle.isEqual(hotspotTitle2)).to.be.false;
        });

        it('MemberList', () => {
            const memberList = new MemberList([
                new CityzenId('111'),
                new CityzenId('222'),
                new CityzenId('3333'),
                new CityzenId('111'),
            ]);
            const memberList2 = new MemberList([
                new CityzenId('111'),
                new CityzenId('3333'),
                new CityzenId('111'),
            ]);

            Chai.expect(memberList.isEqual(memberList)).to.be.true;
            Chai.expect(memberList.isEqual(memberList2)).to.be.false;
        });

        it('Position', () => {
            const position = new Position(0, 1);
            const position2 = new Position(1, 0);

            Chai.expect(position.isEqual(position)).to.be.true;
            Chai.expect(position.isEqual(position2)).to.be.false;
        });

        it('ViewsCount', () => {
            const viewCount = new ViewsCount(42);
            const viewCount2 = new ViewsCount(420);

            Chai.expect(viewCount.isEqual(viewCount)).to.be.true;
            Chai.expect(viewCount.isEqual(viewCount2)).to.be.false;
        });

        it('Author', () => {
            const author = new Author('pseudopseudo', new CityzenId('idid'));
            const author2 = new Author('pseudopseudochanged', new CityzenId('idid'));
            const author3 = new Author('pseudopseudochanged', new CityzenId('idid2'));

            Chai.expect(author.isEqual(author2)).to.be.true;
            Chai.expect(author.isEqual(author3)).to.be.false;
        });

        it('CityId', () => {
            const cityId = new CityId('idid');
            const cityId2 = new CityId('idid2');

            Chai.expect(cityId.isEqual(cityId)).to.be.true;
            Chai.expect(cityId.isEqual(cityId2)).to.be.false;
        });

        it('Address', () => {
            const address = new Address('namename', 'citycity');
            const address2 = new Address('namename2', 'citycity');

            Chai.expect(address.isEqual(address)).to.be.true;
            Chai.expect(address.isEqual(address2)).to.be.false;
        });

        it('CityzenId', () => {
            const cityzenId1 = new CityzenId('id id 1');
            const cityzenId2 = new CityzenId('id id 2');

            Chai.expect(cityzenId1.isEqual(cityzenId1)).to.be.true;
            Chai.expect(cityzenId1.isEqual(cityzenId2)).to.be.false;
        });

        it('ImageLocation', () => {
            const imgLocation = new ImageLocation('fake-url');
            const otherImgLocation = new ImageLocation('fake-url');
            const againImgLocation = new ImageLocation('fake-url-trap');

            Chai.expect(imgLocation.isEqual(otherImgLocation)).to.be.true;
            Chai.expect(imgLocation.isEqual(againImgLocation)).to.be.false;
        });

        it('SlideShow.', () => {
            const slideShow = new SlideShow([new ImageLocation('fake-url')]);
            const otherSlideShow = new SlideShow([new ImageLocation('fake-url')]);
            const againSlideShow = new SlideShow([new ImageLocation('fake-url-trap')]);

            Chai.expect(slideShow.isEqual(otherSlideShow)).to.be.true;
            Chai.expect(slideShow.isEqual(againSlideShow)).to.be.false;
        });
    });
});
