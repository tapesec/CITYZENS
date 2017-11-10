import { HotspotRepositoryInMemory } from '../../../infrastructure/HotspotRepositoryInMemory';
import Hotspot from '../../../domain/cityLife/model/Hotspot';
import * as helpers from './../../helpers';

const hotspotsByArea = (
    queryStrings : any, 
    hotspotRepository : HotspotRepositoryInMemory,
) : Hotspot[] => {

    if (helpers.latitudeLongitude(queryStrings)) {
        return hotspotRepository.findInArea(
            queryStrings.north,
            queryStrings.west,
            queryStrings.south,
            queryStrings.east,
        );
    } else {
        return [];
    }
};

export default hotspotsByArea;
