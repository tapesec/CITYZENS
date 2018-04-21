import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import Cityzen from '../domain/cityzens/model/Cityzen';
import CityzenId from '../domain/cityzens/model/CityzenId';

const findById = (postgre: PostgreSQL, id: CityzenId) => {
    return postgre
        .query('SELECT * from cityzens WHERE user_id = $1', [id.toString()])
        .then(results => {
            if (results.rowCount === 0) {
                return undefined;
            }

            const data = results.rows[0];

            return this.cityzenFactory.build(data) as Cityzen;
        });
};
const updateFavortiesHotspots = (postgre: PostgreSQL, data: string[], id: CityzenId) => {
    return postgre.query('UPDATE cityzens SET favorites_hotspots = $1 WHERE user_id = $2', [
        data,
        id,
    ]);
};

const orm = {
    findById,
    updateFavortiesHotspots,
};

export default orm;

export type Orm = typeof orm;
