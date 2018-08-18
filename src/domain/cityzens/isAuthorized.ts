import Cityzen from './model/Cityzen';
import CityzenId from './model/CityzenId';

const isAuthorized = {
    toUpdateCityzen: (cityzen: Cityzen, cityzenId: CityzenId) => {
        if (cityzen.id === cityzenId) return true;
        return cityzen.isAdmin;
    },
};

export default isAuthorized;
