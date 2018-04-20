import Cityzen from '../domain/cityzens/model/Cityzen';
import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import Auth0Service from '../api/services/auth/Auth0Service';
import CityzenId from '../domain/cityzens/model/CityzenId';

class CityzenAuth0Repository implements ICityzenRepository {
    protected auth0Service: Auth0Service;

    constructor(auth0: Auth0Service) {
        this.auth0Service = auth0;
    }

    updateFavoritesHotspots = (cityzen: Cityzen, accessToken: string) => {
        const favoritesHotspots = [...cityzen.favoritesHotspots];
        return this.auth0Service.updateMetadata(cityzen.id, accessToken, { favoritesHotspots });
    };

    findById(id: CityzenId): Promise<Cityzen> {
        throw new Error('Method not implemented.');
    }
}

export default CityzenAuth0Repository;
