import Cityzen from './Cityzen';
import CityzenId from './CityzenId';
import { QueryResult } from 'pg';

export default interface ICityzenRepository {
    updateFavoritesHotspots(data: string[], id: CityzenId): Promise<void>;
    findById(id: CityzenId): Promise<Cityzen>;
    updateCityzen(cityzen: Cityzen): Promise<QueryResult>;
    habitantInscris(email: string, password: string): Promise<Cityzen | undefined>;
};
