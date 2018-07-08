import AlertHotspot from '../../../domain/cityLife/model/hotspot/AlertHotspot';
import { HotspotType } from '../../../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from '../../../domain/cityLife/model/hotspot/MediaHotspot';
import AlertHotspotSample from '../../../domain/cityLife/model/sample/AlertHotspotSample';
import MediaHotspotsSample from '../../../domain/cityLife/model/sample/MediaHotspotSample';
import MessageSample from '../../../domain/cityLife/model/sample/MessageSample';
import Cityzen from '../../../domain/cityzens/model/Cityzen';
import CityzenSample from '../../../domain/cityzens/model/CityzenSample';
import MapToObject from '../../../helpers/MapToObject';
import config from './../../../api/config';
import { CITYZEN_TABLE_NAME, HOTSPOT_TABLE_NAME, MESSAGE_TABLE_NAME } from './constants';
import { hstoreConverter } from './hstoreConverter';
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
            picture_cityzen text NOT NULL DEFAULT '${config.cityzen.defaultAvatar}',
            picture_extern text,
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
                `INSERT INTO ${CITYZEN_TABLE_NAME}
                    (user_id, password, email_verified, email, pseudo, is_admin, favorites_hotspots, picture_cityzen, picture_extern)` +
                `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

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
                cityzen.pictureCityzen.toString(),
                cityzen.pictureExtern.toString(),
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

const messages = async (postgre: PostgreSQL) => {
    try {
        const exist = await postgre.tableExist(MESSAGE_TABLE_NAME);
        if (exist) return;

        const createTableQueryString = `
            CREATE TABLE messages (
                id text NOT NULL UNIQUE,
                author_id text NOT NULL,
                hotspot_id text NOT NULL,
                title text,
                body text,
                pinned boolean DEFAULT FALSE,
                created_at timestamp NOT NULL DEFAULT current_timestamp,
                updated_at timestamp,
                parent_id text
            )
        `;

        await postgre.query(createTableQueryString);

        const messagesSample = [
            MessageSample.MARTIGNAS_CHURCH_MESSAGE,
            MessageSample.MARTIGNAS_SCHOOL_MESSAGE,
            MessageSample.MARTIGNAS_TOWNHALL_MESSAGE,
            MessageSample.SIMCITY_TOEDIT_MESSAGE,
        ];

        for (const entry of messagesSample) {
            const query = `
                INSERT INTO ${MESSAGE_TABLE_NAME} (id, author_id, hotspot_id, title, body, pinned, created_at, updated_at, parent_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;

            await postgre.query(query, [
                entry.id.toString(),
                entry.author.id.toString(),
                entry.hotspotId.toString(),
                entry.title,
                entry.body,
                entry.pinned,
                entry.createdAt.toUTCString(),
                entry.updatedAt.toUTCString(),
                entry.parentId === undefined ? 'null' : entry.parentId.toString(),
            ]);

            await new Promise((resolve, reject) => {
                setTimeout(resolve, 500);
            });
        }
    } catch (error) {
        console.log("Can't connect to database: ", error);
        process.exit(1);
    }
};

const hotspots = async (postgre: PostgreSQL) => {
    try {
        const exist = await postgre.tableExist(HOTSPOT_TABLE_NAME);

        if (exist) return;

        const query = `
            CREATE TABLE hotspots (
                id text NOT NULL,
                author_id text NOT NULL,
                position_lat numeric NOT NULL,
                position_lon numeric NOT NULL,
                address_city text NOT NULL,
                address_name text NOT NULL,
                picture text NOT NULL,
                views integer NOT NULL,
                type text NOT NULL,
                city_id text NOT NULL,
                created_at timestamp NOT NULL DEFAULT current_timestamp,

                picture_description text,
                message_content text,
                message_updated_at timestamp,
                pertinence_agree integer,
                pertinence_disagree integer,
                voter_list hstore,

                scope text,
                title text,
                slug text,
                members text[],
                slideshow text[],

                removed boolean DEFAULT FALSE,
                cache_algolia boolean DEFAULT FALSE
            )
        `;

        await postgre.query(query);

        const hotspotsSample = [
            MediaHotspotsSample.CHURCH,
            MediaHotspotsSample.DOCTOR,
            MediaHotspotsSample.MATCH_EVENT,
            MediaHotspotsSample.MERIGNAC,
            MediaHotspotsSample.SCHOOL,
            MediaHotspotsSample.TO_READ_EVENT_HOTSPOT_FOR_TEST,
            MediaHotspotsSample.TOEDIT,
            MediaHotspotsSample.TOWNHALL,

            AlertHotspotSample.ACCIDENT,
            AlertHotspotSample.TO_READ_ALERT_HOTSPOT_FOR_TU,
            AlertHotspotSample.TOEDIT_CAMELOT,
        ];

        for (const entry of hotspotsSample) {
            if (entry instanceof AlertHotspot) {
                const query = `
                    INSERT INTO ${HOTSPOT_TABLE_NAME} (
                        id, author_id, position_lat, position_lon, address_city, address_name, picture, views, type, created_at, city_id,
                        picture_description, message_content, message_updated_at, pertinence_agree, pertinence_disagree, voter_list
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '${
                        HotspotType.Alert
                    }', $9, $10, $11, $12, $13, $14, $15, $16)
                `;

                await postgre.query(query, [
                    entry.id.toString(),
                    entry.author.id.toString(),
                    entry.position.latitude,
                    entry.position.longitude,
                    entry.address.city,
                    entry.address.name,
                    entry.avatarIconUrl.toString(),
                    entry.views,
                    entry.createdAt.toUTCString(),
                    entry.cityId,
                    entry.pictureDescription.toString(),
                    entry.message.content,
                    entry.message.updatedAt.toUTCString(),
                    entry.pertinence.nAgree,
                    entry.pertinence.nDisagree,
                    hstoreConverter.stringify(MapToObject(entry.voterList.list)),
                ]);
            }
            if (entry instanceof MediaHotspot) {
                const query = `
                    INSERT INTO ${HOTSPOT_TABLE_NAME} (
                        id, author_id, position_lat, position_lon, address_city, address_name, picture, views, type, created_at,
                        city_id, scope, title, slug, members, slideshow
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '${
                        HotspotType.Media
                    }', $9, $10, $11, $12, $13, $14, $15)
                `;

                await postgre.query(query, [
                    entry.id.toString(),
                    entry.author.id.toString(),
                    entry.position.latitude,
                    entry.position.longitude,
                    entry.address.city,
                    entry.address.name,
                    entry.avatarIconUrl.toString(),
                    entry.views,
                    entry.createdAt.toUTCString(),
                    entry.cityId,
                    entry.scope,
                    entry.title,
                    entry.slug,
                    entry.members.toArray().map(x => x.toString()),
                    entry.slideShow.list.map(x => x.toString()),
                ]);
            }

            await new Promise((resolve, reject) => {
                setTimeout(resolve, 500);
            });
        }
    } catch (error) {
        console.log("Can't connect to database: ", error);
        process.exit(1);
    }
};

const CheckAndCreateTable = {
    cityzens,
    messages,
    hotspots,
};

export default CheckAndCreateTable;
