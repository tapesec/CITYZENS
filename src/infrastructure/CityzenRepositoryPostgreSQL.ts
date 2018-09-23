import * as ajv from 'ajv';
import { cityzensDbSchema } from '../api/requestValidation/schema';
import CityzenId from '../application/domain/cityzen/CityzenId';
import ICityzenRepository from '../application/domain/cityzen/ICityzenRepository';
import OrmCityzen from './../infrastructure/ormCityzen';
import CityzenFactory from '../application/domain/cityzen/CityzenFactory';
import Cityzen from '../application/domain/cityzen/Cityzen';
import { QueryResult } from 'pg';

export default class CityzenRepositoryPostgreSQL implements ICityzenRepository {
    private cityzenFactory: CityzenFactory;
    private validator: ajv.Ajv = new ajv();

    constructor(protected orm: OrmCityzen) {
        this.cityzenFactory = new CityzenFactory();
    }

    public updateFavoritesHotspots(data: string[], id: CityzenId) {
        return this.orm.updateFavoritesHotspots(data, id).then(() => {});
    }
    public async findById(id: CityzenId) {
        const data = await this.orm.findById(id);
        // console.log(data, 'data cityzen');
        return this.cityzenFactory.build(data);
    }

    public updateCityzen(cityzen: Cityzen): Promise<QueryResult> {
        return this.orm.update(cityzen);
    }
}
