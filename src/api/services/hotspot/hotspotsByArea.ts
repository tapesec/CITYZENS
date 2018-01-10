import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryInMemory';
import Hotspot from '../../../domain/cityLife/model/hotspot/Hotspot';

const hotspotsByArea = (
    queryStrings : any,
    hotspotRepository : HotspotRepositoryInMemory,
) : Hotspot[] => {

    return hotspotRepository.findInArea(
        queryStrings.north,
        queryStrings.west,
        queryStrings.south,
        queryStrings.east,
    );
};

export default hotspotsByArea;
