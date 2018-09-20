import pg from './libs/postgreSQL/postgreSQL';
import { hstoreConverter } from './libs/postgreSQL/hstoreConverter';
import MapToObject from '../helpers/MapToObject';
import config from '../api/config';

import Cityzen from '../application/domain/cityzen/Cityzen';
import MediaHotspot from '../application/domain/hotspot/MediaHotspot';
import AlertHotspot from '../application/domain/hotspot/AlertHotspot';
import CityzenSample from '../application/domain/sample/CityzenSample';
import MessageSample from '../application/domain/sample/MessageSample';
import MediaHotspotsSample from '../application/domain/sample/MediaHotspotSample';
import AlertHotspotSample from '../application/domain/sample/AlertHotspotSample';
import { HotspotType } from '../application/domain/hotspot/Hotspot';

export const CITYZEN_TABLE_NAME = 'cityzens';
export const MESSAGE_TABLE_NAME = 'messages';
export const HOTSPOT_TABLE_NAME = 'hotspots';

export const initDB = async () => {
    console.log('Initializing database ...');
    try {
        await pg.query(`CREATE TABLE IF NOT EXISTS cityzens (
        user_id text NOT NULL UNIQUE PRIMARY KEY,
        password text, 
        email text NOT NULL UNIQUE,
        email_verified boolean DEFAULT FALSE,
        pseudo text,
        description text,
        picture_cityzen text NOT NULL DEFAULT '${config.cityzen.defaultAvatar}',
        picture_extern text,
        is_admin boolean DEFAULT FALSE,
        favorites_hotspots text[],
        created_at timestamp NOT NULL DEFAULT current_timestamp)`);

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

            const query = `INSERT INTO ${CITYZEN_TABLE_NAME}
                    (user_id, password, email_verified, email, pseudo, is_admin, favorites_hotspots, picture_cityzen, picture_extern)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (user_id)
            DO NOTHING;`;

            const favorites =
                cityzen.favoritesHotspots !== undefined
                    ? Array.from(cityzen.favoritesHotspots)
                    : [];

            await pg.query(query, [
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

            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });
        }

        await pg.query(`CREATE TABLE IF NOT EXISTS messages (
        id text NOT NULL UNIQUE PRIMARY KEY,
        author_id text NOT NULL,
        hotspot_id text NOT NULL,
        title text,
        body text,
        pinned boolean DEFAULT FALSE,
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        updated_at timestamp,
        parent_id text,
        removed boolean DEFAULT FALSE
    )`);

        const messagesSample = [
            MessageSample.MARTIGNAS_CHURCH_MESSAGE,
            MessageSample.MARTIGNAS_SCHOOL_MESSAGE,
            MessageSample.MARTIGNAS_TOWNHALL_MESSAGE,
            MessageSample.SIMCITY_TOEDIT_MESSAGE,
        ];

        for (const entry of messagesSample) {
            const query = `
            INSERT INTO ${MESSAGE_TABLE_NAME} (id, author_id, hotspot_id, title, body, pinned, created_at, updated_at, parent_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id)
            DO NOTHING;
        `;

            await pg.query(query, [
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

            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });
        }

        await pg.query(`CREATE TABLE IF NOT EXISTS hotspots (
        id text NOT NULL UNIQUE PRIMARY KEY,
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
    )`);

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
                }', $9, $10, $11, $12, $13, $14, $15, $16) ON CONFLICT (id)
                DO NOTHING;
            `;

                await pg.query(query, [
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
                }', $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (id)
                DO NOTHING;
            `;

                await pg.query(query, [
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
                    entry.slideShow.list.map((x: any) => x.toString()),
                ]);
            }

            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });
        }
    } catch (error) {
        console.log(error.message);
        return error;
    }
};
