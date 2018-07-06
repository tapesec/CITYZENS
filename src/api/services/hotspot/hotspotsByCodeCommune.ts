import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryPostgreSQL';

const hotspotsByCodeCommune = (insee: string, repository: HotspotRepositoryInMemory) => {
    return repository.findByCodeCommune(insee);
};

export default hotspotsByCodeCommune;
