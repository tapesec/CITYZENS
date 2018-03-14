import HotspotId from '../../../../src/domain/cityLife/model/hotspot/HotspotId';
import HotspotSlug from '../../../../src/domain/cityLife/model/hotspot/HotspotSlug';
import HotspotTitle from '../../../../src/domain/cityLife/model/hotspot/HotspotTitle';
import MemberList from '../../../../src/domain/cityLife/model/hotspot/MemberList';
import Position from '../../../../src/domain/cityLife/model/hotspot/Position';
import ViewsCount from '../../../../src/domain/cityLife/model/hotspot/ViewsCount';
import Address from '../../../../src/domain/cityLife/model/hotspot/Address';
import CityId from '../../../../src/domain/cityLife/model/city/CityId';
import Author from '../../../../src/domain/cityLife/model/author/Author';

import * as Chai from 'chai';

describe('ValueObject', () => {
    describe('Equality checks', () => {
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
            const memberList = new MemberList(['111', '222', '3333', '111']);
            const memberList2 = new MemberList(['111', '3333', '111']);

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
            const author = new Author('pseudopseudo', 'idid');
            const author2 = new Author('pseudopseudochanged', 'idid');
            const author3 = new Author('pseudopseudochanged', 'idid2');

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
    });
});
