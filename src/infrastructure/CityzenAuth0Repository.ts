import Cityzen from '../domain/cityzens/model/Cityzen';
import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import Auth0Info, { auth0Info } from './../api/services/auth/Auth0Info';

class CityzenAuth0Repository implements ICityzenRepository {

    protected auth0Service : Auth0Info;

    constructor(auth0 : Auth0Info) {
        this.auth0Service = auth0;
    }

    updateFavoritesHotspots = (cityzen : Cityzen, accessToken: string) => {
        const favoritesHotspots = [...cityzen.favoritesHotspots];
        return this.auth0Service.updateMetadata(
            cityzen.id, 
            accessToken, 
            { favoritesHotspots }
        );
    }
}

export { CityzenAuth0Repository };
const cityzenAuth0Repository = new CityzenAuth0Repository(auth0Info);
export default cityzenAuth0Repository;
