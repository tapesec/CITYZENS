import Cityzen from '../domain/cityzens/model/Cityzen';
import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import auth0, { Auth0ManagementclientApi } from '../api/services/Auth0';

class CityzenAuth0Repository implements ICityzenRepository {
    
    protected auth0Service : Auth0ManagementclientApi;

    constructor(auth0 : Auth0ManagementclientApi) {
        this.auth0Service = auth0;
    }

    updateFavoritsHotspots = (cityzen : Cityzen) => {
        const favoritesHotspots = cityzen.favoritesHotspots;
        return this.auth0Service.updateUserMetadataById(cityzen.id, { favoritesHotspots });
    }
}

export { CityzenAuth0Repository };
const cityzenAuth0Repository = new CityzenAuth0Repository(auth0);
export default cityzenAuth0Repository;
