import { expect } from 'chai';
import HotspotReducer from './../../../../../src/api/services/hotspot/HotspotReducer';
import WallHotspotSample from './../../../../../src/domain/cityLife/model/sample/WallHotspotSample';
import AlertHotspotSample from './../../../../../src/domain/cityLife/model/sample/AlertHotspotSample';
import { HotspotScope } from '../../../../../src/domain/cityLife/model/hotspot/Hotspot';
import CityzenSample from '../../../../../src/domain/cityzens/model/CityzenSample';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';

describe('filterHotspotByOwnerShip', () => {
    it('should return all the public hotspot passed in parameter', () => {
        const hotspotsToFilter = [
            WallHotspotSample.DOCTOR, // private hotspot type
            WallHotspotSample.CHURCH,
            WallHotspotSample.DOCTOR,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        // to be continued …
        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        hotspotReducer.pickPublicHotspot();
        const hotspotsFiltered = hotspotReducer.releaseFilteredHotspots();
        expect(hotspotsFiltered.length).to.be.eql(3);
        expect(hotspotsFiltered).to.have.all.members([
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ]);
    });

    it('should return hotspot by ownership', () => {
        const hotspotsToFilter = [
            WallHotspotSample.DOCTOR, // private hotspot type
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        // to be continued …
        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        hotspotReducer.pickHotspotOwnerShip(AuthorSample.LIONNEL2);
        const hotspotsFiltered = hotspotReducer.releaseFilteredHotspots();
        expect(hotspotsFiltered.length).to.be.eql(1);
        expect(hotspotsFiltered).to.have.all.members([WallHotspotSample.DOCTOR]);
    });

    it('should return hotspot by membership', () => {
        const hotspotsToFilter = [
            WallHotspotSample.DOCTOR, // private hotspot type ELODIE is member
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
            AlertHotspotSample.ACCIDENT,
        ];

        // to be continued …
        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        hotspotReducer.pickHotspotMemberShip(AuthorSample.ELODIE.id);
        const hotspotsFiltered = hotspotReducer.releaseFilteredHotspots();
        expect(hotspotsFiltered.length).to.be.eql(1);
        expect(hotspotsFiltered).to.have.all.members([WallHotspotSample.DOCTOR]);
    });

    it('should return hotspot depend on status caller', () => {
        const hotspotsToFilter = [
            WallHotspotSample.DOCTOR, // private hotspot type ELODIE is member
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        const hotspotsFiltered = hotspotReducer.renderVisibleHotspotsByVisitorStatus(
            CityzenSample.LIONNEL2,
        );
        expect(hotspotsFiltered.length).to.be.eql(4);
        expect(hotspotsFiltered).to.have.all.members([
            WallHotspotSample.DOCTOR,
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ]);
    });

    it('should return only public hotspot if no cityzen call was provided even if filter were applied', () => {
        const hotspotsToFilter = [
            WallHotspotSample.DOCTOR, // private hotspot type ELODIE is member
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        const hotspotsFiltered = hotspotReducer.renderVisibleHotspotsByVisitorStatus(undefined);
        expect(hotspotsFiltered.length).to.be.eql(3);
        expect(hotspotsFiltered).to.have.all.members([
            WallHotspotSample.CHURCH,
            WallHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ]);
    });
});
