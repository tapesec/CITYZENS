import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import CityzenId from '../domain/cityzens/model/CityzenId';
import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import { Orm } from './../infrastructure/ormCityzen';

export default class CityzenRepositoryPostgreSQL implements ICityzenRepository {
    constructor(protected orm: Orm, protected postgre: PostgreSQL) {}

    updateFavoritesHotspots(data: string[], id: CityzenId) {
        return this.orm.updateFavortiesHotspots(this.postgre, data, id).then(() => {});
    }
    findById(id: CityzenId) {
        return this.orm.findById(this.postgre, id);
    }
}
