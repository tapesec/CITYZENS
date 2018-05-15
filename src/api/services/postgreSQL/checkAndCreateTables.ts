import PostgreSQL from './postgreSQL';
import { CITYZEN_TABLE_NAME, CITYZEN_TABLE_SCHEMA } from './constants';
import CityzenSample from '../../../domain/cityzens/model/CityzenSample';
import Cityzen from '../../../domain/cityzens/model/Cityzen';

const cityzens = async (postgre: PostgreSQL) => {
    try {
        const exist = await postgre.tableExist(CITYZEN_TABLE_NAME);
        if (exist) return;

        let promise = Promise.resolve();
        await postgre.createTable(CITYZEN_TABLE_SCHEMA);

        const cityzens: [Cityzen, string][] = [
            [CityzenSample.ELODIE, '$2a$10$soIZ/r/5MU1IUqTwM2aGfuNu6RSEifpd4PVuwWRoeV3h/ocscwXI6'],
            [CityzenSample.LIONNEL, '$2a$10$f91V2BA33AvwkGTvfj6Un.RVPfhZy57cgZXRxB4ga3PTU0rNHXN5W'],
            [CityzenSample.LOUISE, '$2a$10$GRfcRux9E68nffMtnCDAX.oBeIpmTyiBU5oKQ1/eR8JKuwS6byWUi'],
            [CityzenSample.LUCA, '$2a$10$jD1GFLoCcvP4EWPMyKuJJ.Lw0dvgMVXs5fl8jDybnD7hUx970Y1sm'],
            [CityzenSample.MARTIN, '$2a$10$yeKNJMuyDe6xo7mCc2wJe.ENH7hJnBYArUZwJYneNoEeC9IWMgVPq'],
        ];

        cityzens.forEach(entry => {
            const cityzen = entry[0];
            const password = entry[1];

            const query =
                `INSERT INTO ${CITYZEN_TABLE_NAME}(user_id, password, email, pseudo, is_admin, favorites_hotspots) ` +
                `VALUES ($1, $2, $3, $4, $5, $6)`;

            const favorites =
                cityzen.favoritesHotspots !== undefined
                    ? Array.from(cityzen.favoritesHotspots)
                    : [];
            promise = promise
                .then(async v => {
                    await postgre.query(query, [
                        cityzen.id.toString(),
                        password,
                        cityzen.email,
                        cityzen.pseudo,
                        cityzen.isAdmin,
                        favorites,
                    ]);
                })
                .then(async v => {
                    await new Promise((resolve, reject) => {
                        setTimeout(resolve, 500);
                    });
                });
        });
        // i need to chain the promises instead of parallelizing them
        // because of rate limiting in sql.
        await promise;
    } catch (error) {
        console.log(error);
    }
};

const CheckAndCreateTable = {
    cityzens,
};

export default CheckAndCreateTable;
