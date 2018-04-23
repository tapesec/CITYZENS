import HotspotRepositoryInMemory from '../../../infrastructure/HotspotRepositoryInMemory';

const hotspotsByCodeCommune = (insee: string, repository: HotspotRepositoryInMemory) => {
    return repository.findByCodeCommune(insee);
};

export default hotspotsByCodeCommune;
