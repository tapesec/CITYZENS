import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import CityzenId from '../domain/cityzens/model/CityzenId';

class OrmCityzen {
    constructor(private postgre: PostgreSQL) {}

    findById = (id: CityzenId) => {
        return this.postgre
            .query('SELECT * from cityzens WHERE user_id = $1', [id.toString()])
            .then(results => {
                if (results.rowCount === 0) {
                    return undefined;
                }

                const data = results.rows[0];

                return data;
            });
    };
    getAllAuthors = (ids: CityzenId[]) => {
        if (ids.length === 0) return Promise.resolve<{ id: string; pseudo: string }[]>([]);

        let queryString = 'SELECT user_id, nickname from cityzens WHERE user_id IN (';
        for (let i = 0; i + 1 < ids.length; i += 1) {
            queryString += `${i}, `;
        }
        queryString += `${ids[ids.length - 1]})`;

        const processedIds = ids.map(i => i.toInt());

        return this.postgre.query(queryString, processedIds).then(results => {
            if (results.rowCount === 0) {
                return undefined;
            }

            const data = results.rows as any[];
            return data.map(e => {
                return {
                    id: `auth0|postgre|${e.user_id}`,
                    pseudo: e.nickname,
                };
            });
        });
    };
    updateFavoritesHotspots = (data: string[], id: CityzenId) => {
        return this.postgre.query(
            'UPDATE cityzens SET favorites_hotspots = $1 WHERE user_id = $2',
            [data, id],
        );
    };
}

export default OrmCityzen;
