import { expect } from 'chai';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';
import CityzenSample from '../../../../../src/domain/cityzens/model/CityzenSample';
import HotspotReducer from './../../../../../src/api/services/hotspot/HotspotReducer';
import AlertHotspotSample from './../../../../../src/domain/cityLife/model/sample/AlertHotspotSample';
import MediaHotspotSample from './../../../../../src/domain/cityLife/model/sample/MediaHotspotSample';

describe('filterHotspotByOwnerShip', () => {
    it('should return all the public hotspot passed in parameter', () => {
        const hotspotsToFilter = [
            MediaHotspotSample.DOCTOR, // private hotspot type
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.DOCTOR,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        // to be continued …
        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        hotspotReducer.pickPublicHotspot();
        const hotspotsFiltered = hotspotReducer.releaseFilteredHotspots();
        expect(hotspotsFiltered.length).to.be.eql(3);
        expect(hotspotsFiltered).to.have.all.members([
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ]);
    });

    it('should return hotspot by ownership', () => {
        const hotspotsToFilter = [
            MediaHotspotSample.DOCTOR, // private hotspot type
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        // to be continued …
        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        hotspotReducer.pickHotspotOwnerShip(AuthorSample.LIONNEL);
        const hotspotsFiltered = hotspotReducer.releaseFilteredHotspots();
        expect(hotspotsFiltered.length).to.be.eql(1);
        expect(hotspotsFiltered).to.have.all.members([MediaHotspotSample.DOCTOR]);
    });

    it('should return hotspot by membership', () => {
        const hotspotsToFilter = [
            MediaHotspotSample.DOCTOR, // private hotspot type ELODIE is member
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
            AlertHotspotSample.ACCIDENT,
        ];

        // to be continued …
        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        hotspotReducer.pickHotspotMemberShip(AuthorSample.ELODIE.id);
        const hotspotsFiltered = hotspotReducer.releaseFilteredHotspots();
        expect(hotspotsFiltered.length).to.be.eql(1);
        expect(hotspotsFiltered).to.have.all.members([MediaHotspotSample.DOCTOR]);
    });

    it('should return hotspot depend on status caller', () => {
        const hotspotsToFilter = [
            MediaHotspotSample.DOCTOR, // private hotspot type ELODIE is member
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        const hotspotsFiltered = hotspotReducer.renderVisibleHotspotsByVisitorStatus(
            CityzenSample.LIONNEL,
        );
        expect(hotspotsFiltered.length).to.be.eql(4);
        expect(hotspotsFiltered).to.have.all.members([
            MediaHotspotSample.DOCTOR,
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ]);
    });

    it('should return only public hotspot if no cityzen call was provided even if filter were applied', () => {
        const hotspotsToFilter = [
            MediaHotspotSample.DOCTOR, // private hotspot type ELODIE is member
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ];

        const hotspotReducer = new HotspotReducer(hotspotsToFilter);
        const hotspotsFiltered = hotspotReducer.renderVisibleHotspotsByVisitorStatus(undefined);
        expect(hotspotsFiltered.length).to.be.eql(3);
        expect(hotspotsFiltered).to.have.all.members([
            MediaHotspotSample.CHURCH,
            MediaHotspotSample.MERIGNAC,
            AlertHotspotSample.ACCIDENT,
        ]);
    });
});
