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

            Chai.expect(hotspotId.isEqual(hotspotId)).to.be.true;
        });

        it('hotspotSlug', () => {
            const hotspotSlug = new HotspotSlug('slugslug');

            Chai.expect(hotspotSlug.isEqual(hotspotSlug)).to.be.true;
        });

        it('hotspotTitle', () => {
            const hotspotTitle = new HotspotTitle('titletitle');

            Chai.expect(hotspotTitle.isEqual(hotspotTitle)).to.be.true;
        });

        it('MemberList', () => {
            const memberList = new MemberList(['111', '222', '3333', '111']);

            Chai.expect(memberList.isEqual(memberList)).to.be.true;
        });

        it('Position', () => {
            const position = new Position(0, 1);

            Chai.expect(position.isEqual(position)).to.be.true;
        });

        it('ViewsCount', () => {
            const viewCount = new ViewsCount(42);

            Chai.expect(viewCount.isEqual(viewCount)).to.be.true;
        });

        it('Author', () => {
            const author = new Author('pseudopseudo', 'idid');
            const author2 = new Author('pseudopseudochanged', 'idid');

            Chai.expect(author.isEqual(author2)).to.be.true;
        });

        it('CityId', () => {
            const cityId = new CityId('idid');

            Chai.expect(cityId.isEqual(cityId)).to.be.true;
        });

        it('Address', () => {
            const address = new Address('namename', 'citycity');

            Chai.expect(address.isEqual(address)).to.be.true;
        });
    });
});
