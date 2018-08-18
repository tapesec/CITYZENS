import * as ajv from 'ajv';
import { cityzensDbSchema } from '../api/requestValidation/schema';
import CityzenId from '../domain/cityzens/model/CityzenId';
import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import OrmCityzen from './../infrastructure/ormCityzen';
import CityzenFactory from './CityzenFactory';
import Cityzen from '../domain/cityzens/model/Cityzen';

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

    public updateCityzen(cityzen: Cityzen) {
        return this.orm.update(cityzen);
    }
}
