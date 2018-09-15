import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import CityzenId from '../domain/model/CityzenId';
import Cityzen from '../domain/model/Cityzen';

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
        if (data.picture_extern === null) data.picture_extern = undefined;

        return data;
    };
    getAllAuthors = async (ids: CityzenId[]) => {
        if (ids.length === 0) return [];

        let queryString =
            'SELECT user_id, pseudo, picture_cityzen, picture_extern from cityzens WHERE user_id IN (';
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
                pictureCityzen: e.picture_cityzen,
                pictureExtern: e.picture_extern === null ? undefined : e.picture_extern,
            };
        });
    };
    updateFavoritesHotspots = (data: string[], id: CityzenId) => {
        return this.postgre.query(
            'UPDATE cityzens SET favorites_hotspots = $1 WHERE user_id = $2',
            [data, id.toString()],
        );
    };
    update(cityzen: Cityzen) {
        const query = `
            UPDATE cityzens
            SET description = $2, picture_cityzen = $3
            WHERE user_id = $1
        `;
        const values = [
            cityzen.id.toString(),
            cityzen.description,
            cityzen.pictureCityzen.toString(),
        ];

        return this.postgre.query(query, values);
    }
}

export default OrmCityzen;
