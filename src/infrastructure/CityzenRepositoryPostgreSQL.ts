import CityzenId from '../application/domain/cityzen/CityzenId';
import ICityzenRepository, {
    statusInscription,
} from '../application/domain/cityzen/ICityzenRepository';
import OrmCityzen from './../infrastructure/ormCityzen';
import CityzenFactory from '../application/domain/cityzen/CityzenFactory';
import Cityzen from '../application/domain/cityzen/Cityzen';
import { QueryResult } from 'pg';
import { PostgreSQL } from './libs/postgreSQL/postgreSQL';
import { genSaltSync, hashSync } from 'bcryptjs';

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
            'SELECT user_id FROM cityzens WHERE email = $1 AND password = $2',
            [email, password],
        );
        if (result.rowCount === 0) {
            return undefined;
        }
        const data = result.rows[0];
        return this.cityzenFactory.build(data);
    }

    public async inscrisHabitant(cityzen: Cityzen, password: string): Promise<statusInscription> {
        let result = await this.pg.query('SELECT email FROM cityzens WHERE email = $1', [
            cityzen.email,
        ]);
        if (result.rowCount > 0) {
            return statusInscription.EXISTE_DEJA;
        }
        const salt = genSaltSync(10);
        result = await this.pg.query(
            `INSERT INTO cityzens
            (user_id, password, email, pseudo) VALUES (
                $1, $2, $3, $4
              );`,
            [cityzen.id.toString(), hashSync(password, salt), cityzen.email, cityzen.pseudo],
        );
    }
}
