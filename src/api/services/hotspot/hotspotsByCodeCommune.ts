import CityId from '../../../domain/cityLife/model/city/CityId';
import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryPostgreSQL';

const hotspotsByCodeCommune = (insee: CityId, repository: HotspotRepositoryInMemory) => {
    return repository.findByCodeCommune(insee);
};

export default hotspotsByCodeCommune;
