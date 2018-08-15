import * as ajv from 'ajv';
import { cityzensDbSchema } from '../api/requestValidation/schema';
import CityzenId from '../domain/cityzens/model/CityzenId';
import ICityzenRepository from '../domain/cityzens/model/ICityzenRepository';
import OrmCityzen from './../infrastructure/ormCityzen';
import CityzenFactory from './CityzenFactory';

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
        /* if (!this.validator.validate(cityzensDbSchema, data)) {
            throw new Error(
                `Data from database are ill-formed ${this.validator.errorsText()}, ${JSON.stringify(
                    data,
                )}`,
            );
        } */

        return this.cityzenFactory.build(data);
    }
}
