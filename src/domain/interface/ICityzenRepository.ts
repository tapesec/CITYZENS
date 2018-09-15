import Cityzen from '../model/Cityzen';
import CityzenId from '../model/CityzenId';

export default interface ICityzenRepository {
    updateFavoritesHotspots(data: string[], id: CityzenId): Promise<void>;
    findById(id: CityzenId): Promise<Cityzen>;
};
