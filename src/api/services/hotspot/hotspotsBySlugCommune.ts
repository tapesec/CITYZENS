import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryInMemory';
import Hotspot from '../../../domain/cityLife/model/hotspot/Hotspot';

const hotspotsBySlugCommune = (
    slug : string,
    repository : HotspotRepositoryInMemory,
) : Hotspot[] => {
    return repository.findBySlugCommune(slug);
};

export default hotspotsBySlugCommune;
