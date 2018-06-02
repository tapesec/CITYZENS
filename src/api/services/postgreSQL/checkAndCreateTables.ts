import Cityzen from '../../../domain/cityzens/model/Cityzen';
import CityzenSample from '../../../domain/cityzens/model/CityzenSample';
import { CITYZEN_TABLE_NAME } from './constants';
import PostgreSQL from './postgreSQL';

const cityzens = async (postgre: PostgreSQL) => {
    try {
        const exist = await postgre.tableExist(CITYZEN_TABLE_NAME);
        console.log('Connected to the database.');
        if (exist) return;

        const createTable = `CREATE TABLE cityzens (
            user_id text NOT NULL UNIQUE PRIMARY KEY,
            password text, 
            email text NOT NULL UNIQUE,
            email_verified boolean DEFAULT FALSE,
            pseudo text,
            picture text,
            is_admin boolean DEFAULT FALSE,
            favorites_hotspots text[]
        )`;
        await postgre.query(createTable);

        const cityzens: [Cityzen, string][] = [
            [CityzenSample.ELODIE, '$2a$10$soIZ/r/5MU1IUqTwM2aGfuNu6RSEifpd4PVuwWRoeV3h/ocscwXI6'],
            [CityzenSample.LIONNEL, '$2a$10$f91V2BA33AvwkGTvfj6Un.RVPfhZy57cgZXRxB4ga3PTU0rNHXN5W'],
            [CityzenSample.LOUISE, '$2a$10$GRfcRux9E68nffMtnCDAX.oBeIpmTyiBU5oKQ1/eR8JKuwS6byWUi'],
            [CityzenSample.LUCA, '$2a$10$jD1GFLoCcvP4EWPMyKuJJ.Lw0dvgMVXs5fl8jDybnD7hUx970Y1sm'],
            [CityzenSample.MARTIN, '$2a$10$yeKNJMuyDe6xo7mCc2wJe.ENH7hJnBYArUZwJYneNoEeC9IWMgVPq'],
        ];

        for (const entry of cityzens) {
            const cityzen = entry[0];
            const password = entry[1];

            const query =
                `INSERT INTO ${CITYZEN_TABLE_NAME}(user_id, password, email_verified, email, pseudo, is_admin, favorites_hotspots) ` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7)`;

            const favorites =
                cityzen.favoritesHotspots !== undefined
                    ? Array.from(cityzen.favoritesHotspots)
                    : [];
            await postgre.query(query, [
                cityzen.id.toString(),
                password,
                true,
                cityzen.email,
                cityzen.pseudo,
                cityzen.isAdmin,
                favorites,
            ]);

            await new Promise((resolve, reject) => {
                setTimeout(resolve, 500);
            });
        }
    } catch (error) {
        console.log("Can't connect to database.\n", error);
        process.exit(1);
    }
};

const CheckAndCreateTable = {
    cityzens,
};

export default CheckAndCreateTable;
