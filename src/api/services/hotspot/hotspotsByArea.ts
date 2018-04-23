import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryInMemory';

const hotspotsByArea = (queryStrings: any, hotspotRepository: HotspotRepositoryInMemory) => {
    return hotspotRepository.findInArea(
        queryStrings.north,
        queryStrings.west,
        queryStrings.south,
        queryStrings.east,
    );
};

export default hotspotsByArea;
