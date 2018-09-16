import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryPostgreSQL';

const hotspotsByArea = (
    queryStrings: any,
    hotspotRepository: HotspotRepositoryInMemory,
    onError: (error: Error) => void,
) => {
    return hotspotRepository.findInArea(
        queryStrings.north,
        queryStrings.west,
        queryStrings.south,
        queryStrings.east,
        onError,
    );
};

export default hotspotsByArea;
