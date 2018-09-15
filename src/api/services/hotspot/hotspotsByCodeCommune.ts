import CityId from '../../../domain/model/CityId';
import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryPostgreSQL';

const hotspotsByCodeCommune = (
    insee: CityId,
    repository: HotspotRepositoryInMemory,
    onError: (error: Error) => void,
) => {
    return repository.findByCodeCommune(insee, onError);
};

export default hotspotsByCodeCommune;
