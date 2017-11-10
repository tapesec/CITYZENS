import { HotspotRepositoryInMemory } from '../../../infrastructure/HotspotRepositoryInMemory';
import Hotspot from '../../../domain/cityLife/model/Hotspot';

const hotspotsByCodeCommune = (
    insee : string, 
    repository : HotspotRepositoryInMemory,
) : Hotspot[] => {
    return repository.findByCodeCommune(insee);
};

export default hotspotsByCodeCommune;
