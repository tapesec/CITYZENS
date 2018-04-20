import CityzenId from './CityzenId';
import Cityzen from './Cityzen';

export default interface ICityzenRepository {
    updateFavoritesHotspots(data: any, accessToken: string): void;
    findById(id: CityzenId): Promise<Cityzen>;
};
