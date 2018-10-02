import * as ajv from 'ajv';
import CityzenId from '../application/domain/cityzen/CityzenId';
import ICityzenRepository from '../application/domain/cityzen/ICityzenRepository';
import OrmCityzen from './../infrastructure/ormCityzen';
import CityzenFactory from '../application/domain/cityzen/CityzenFactory';
import Cityzen from '../application/domain/cityzen/Cityzen';
import { QueryResult } from 'pg';
import { PostgreSQL } from './libs/postgreSQL/postgreSQL';

export default class CityzenRepositoryPostgreSQL implements ICityzenRepository {
    private cityzenFactory: CityzenFactory;

    constructor(protected orm: OrmCityzen, protected pg: PostgreSQL) {
        this.cityzenFactory = new CityzenFactory();
    }

    public updateFavoritesHotspots(data: string[], id: CityzenId) {
        return this.orm.updateFavoritesHotspots(data, id).then(() => {});
    }
    public async findById(id: CityzenId) {
        const data = await this.orm.findById(id);
        if (!data) {
            return undefined;
        }
        return this.cityzenFactory.build(data);
    }

    public updateCityzen(cityzen: Cityzen): Promise<QueryResult> {
        return this.orm.update(cityzen);
    }

    public async habitantInscris(email: string, password: string): Promise<Cityzen | undefined> {
        const result = await this.pg.query(
            'SELECT id FROM ciyzens WHERE email = $1 AND password = $2',
            [email, password],
        );
        if (result.rowCount === 0) {
            return undefined;
        }
        const data = result.rows[0];
        return this.cityzenFactory.build(data);
    }
}
