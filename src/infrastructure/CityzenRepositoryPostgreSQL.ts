import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import CityzenId from '../domain/cityzens/model/CityzenId';
import Cityzen from '../domain/cityzens/model/Cityzen';
import * as pg from 'pg';
import CityzenFactory from './CityzenFactory';

export default class CityzenRepositoryPostgreSQL implements ICityzenRepository {
    constructor(
        protected orm: any,
        protected postgre: pg.Client,
        protected cityzenFactory: CityzenFactory,
    ) {}

    updateFavoritesHotspots(data: any, accessToken: string): void {
        throw new Error('Method not implemented.');
    }
    findById(id: CityzenId) {
        return this.orm.cityzen.findById(id);
    }
}
