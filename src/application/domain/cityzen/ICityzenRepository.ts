import Cityzen from './Cityzen';
import CityzenId from './CityzenId';

export default interface ICityzenRepository {
    updateFavoritesHotspots(data: string[], id: CityzenId): Promise<void>;
    findById(id: CityzenId): Promise<Cityzen>;
};