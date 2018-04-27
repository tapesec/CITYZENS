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
        let queryString = 'SELECT user_id, nickname from cityzens WHERE user_id IN (';
        ids.forEach((_, i, __) => {
            queryString += `$${i + 1}${i + 1 === ids.length ? '' : ','}`;
        });
        queryString += ')';

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
