import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryPostgreSQL';

const hotspotsByArea = (queryStrings: any, hotspotRepository: HotspotRepositoryInMemory) => {
    return hotspotRepository.findInArea(
        queryStrings.north,
        queryStrings.west,
        queryStrings.south,
        queryStrings.east,
    );
};

export default hotspotsByArea;
