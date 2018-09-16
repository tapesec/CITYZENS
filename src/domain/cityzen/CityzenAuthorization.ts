import Cityzen from './Cityzen';
import CityzenId from './CityzenId';

export interface CityzenAuthorization {
    toUpdateCityzen(cityzen: Cityzen, cityzenId: CityzenId): boolean;
}

const isAuthorized: CityzenAuthorization = {
    toUpdateCityzen: (cityzen: Cityzen, cityzenId: CityzenId) => {
        if (cityzen.id === cityzenId) return true;
        return cityzen.isAdmin;
    },
};

export default isAuthorized;
