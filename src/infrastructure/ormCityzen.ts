import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import CityzenId from '../domain/cityzens/model/CityzenId';
import CheckAndCreateTable from '../api/services/postgreSQL/checkAndCreateTables';

class OrmCityzen {
    constructor(private postgre: PostgreSQL) {}

    findById = async (id: CityzenId) => {
        const results = await this.postgre.query('SELECT * from cityzens WHERE user_id = $1', [
            id.toString(),
        ]);

        if (results.rowCount === 0) {
            return [];
        }

        const data = results.rows[0];

        return data;
    };
    getAllAuthors = async (ids: CityzenId[]) => {
        if (ids.length === 0) return [];

        let queryString = 'SELECT user_id, pseudo from cityzens WHERE user_id IN (';
        for (let i = 0; i + 1 < ids.length; i += 1) {
            queryString += `$${i + 1}, `;
        }
        // i don't want to add the final comma.
        queryString += `$${ids.length})`;

        const results = await this.postgre.query(queryString, ids.map(i => i.toString()));
        if (results.rowCount === 0) {
            return [];
        }

        const data = results.rows as any[];
        return data.map(e => {
            return {
                id: e.user_id,
                pseudo: e.pseudo,
            };
        });
    };
    updateFavoritesHotspots = (data: string[], id: CityzenId) => {
        return this.postgre.query(
            'UPDATE cityzens SET favorites_hotspots = $1 WHERE user_id = $2',
            [data, id.toString()],
        );
    };
}

export default OrmCityzen;
