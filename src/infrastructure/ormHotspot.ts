import { hstoreConverter } from '../api/services/postgreSQL/hstoreConverter';
import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import CityId from '../domain/cityLife/model/city/CityId';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot, { HotspotType } from '../domain/cityLife/model/hotspot/Hotspot';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import MediaHotspot from '../domain/cityLife/model/hotspot/MediaHotspot';
import MapToObject from '../helpers/MapToObject';
const slug = require('slug');
export default class OrmHotspot {
    constructor(private postgre: PostgreSQL) {}

    private constructFromQuery(entry: any) {
        const author = {
            pseudo: entry['pseudo'],
            id: entry['user_id'],
            pictureExtern: entry['picture_extern'],
            pictureCityzen: entry['picture_cityzen'],
        };
        const hotspot = {
            author,
            id: entry['id'],
            position: {
                latitude: parseFloat(entry['position_lat']),
                longitude: parseFloat(entry['position_lon']),
            },
            address: {
                name: entry['address_name'],
                city: entry['address_city'],
            },
            createdAt: entry['created_at'],
            views: parseInt(entry['views'], 10),
            type: entry['type'],
            cityId: entry['city_id'],
        };
        if (entry['type'] === HotspotType.Alert) {
            const voterListObj = hstoreConverter.parse(entry['voter_list']);
            return {
                ...hotspot,
                avatarIconUrl: entry['picture'],
                message: {
                    content: entry['message_content'],
                    updatedAt: entry['message_updated_at'],
                },
                pertinence: {
                    agree: parseInt(entry['pertinence_agree'], 10),
                    disagree: parseInt(entry['pertinence_disagree'], 10),
                },
                pictureDescription: entry['picture_description'],
                voterList: Object.keys(voterListObj).map(x => [
                    x,
                    voterListObj[x] === 'true' ? true : false,
                ]),
            };
        }
        if (entry['type'] === HotspotType.Media) {
            return {
                ...hotspot,
                avatarIconUrl: entry['picture'],
                scope: entry['scope'],
                title: entry['title'],
                slug: entry['slug'],
                members: entry['members'],
                slideShow: entry['slideshow'],
            };
        }
    }

    public async findByArea(north: number, west: number, south: number, east: number) {
        const query = `
            SELECT * from hotspots h JOIN cityzens c ON h.author_id = c.user_id
            WHERE $1 <= h.position_lat AND h.position_lat <= $2 AND
                  $3 <= h.position_lon AND h.position_lon <= $4 AND h.removed = false 
        `;

        const values = [south, north, west, east];

        const result = await this.postgre.query(query, values);

        const hotspots: any[] = [];
        for (const entry of result.rows) {
            hotspots.push(this.constructFromQuery(entry));
        }

        return hotspots;
    }
    public async findByCity(cityId: CityId) {
        const query = `
            SELECT * from hotspots h JOIN cityzens c on h.author_id = c.user_id
            WHERE h.city_id = $1 AND h.removed = false
        `;

        const values = [cityId.toString()];

        const results = await this.postgre.query(query, values);

        const hotspots: any[] = [];
        for (const entry of results.rows) {
            hotspots.push(this.constructFromQuery(entry));
        }
        return hotspots;
    }

    public async findOne(hotspotId: HotspotId) {
        const query =
            'SELECT * from hotspots h JOIN cityzens c ON h.author_id = c.user_id WHERE h.id = $1 AND removed = false';
        const values = [hotspotId.toString()];

        const result = await this.postgre.query(query, values);

        if (result.rowCount < 1) {
            return undefined;
        }
        return this.constructFromQuery(result.rows[0]);
    }

    public async findBySlug(slug: String) {
        const query = `
            SELECT * from hotspots h JOIN cityzens c ON h.author_id = c.user_id WHERE slug = $1 AND removed = false 
        `;
        const values = [slug];

        const result = await this.postgre.query(query, values);

        if (result.rowCount < 1) {
            return undefined;
        }
        return this.constructFromQuery(result.rows[0]);
    }

    public async save(hotspot: Hotspot) {
        if (hotspot instanceof MediaHotspot) await this.saveMedia(hotspot);
        if (hotspot instanceof AlertHotspot) await this.saveAlert(hotspot);
    }
    private async saveMedia(hotspot: MediaHotspot) {
        const query = `
            INSERT INTO hotspots (
                id, members, position_lat, position_lon, scope, slideshow, slug, city_id,
                title, type, views, address_city, address_name, author_id, picture
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `;

        const values = [
            hotspot.id.toString(),
            hotspot.members.toArray().map(x => x.toString()),
            hotspot.position.latitude,
            hotspot.position.longitude,
            hotspot.scope,
            hotspot.slideShow.list.map(x => x.toString()),
            hotspot.slug,
            hotspot.cityId,
            hotspot.title,
            hotspot.type,
            hotspot.views,
            hotspot.address.city,
            hotspot.address.name,
            hotspot.author.id.toString(),
            hotspot.avatarIconUrl.toString(),
        ];

        await this.postgre.query(query, values);
    }
    private async saveAlert(hotspot: AlertHotspot) {
        const query = `
            INSERT INTO hotspots (
                id, picture_description, position_lat, position_lon, message_content, message_updated_at,
                pertinence_agree, pertinence_disagree, type, views, address_city, address_name, author_id,
                picture, voter_list, city_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `;

        const values = [
            hotspot.id.toString(),
            hotspot.pictureDescription.toString(),
            hotspot.position.latitude,
            hotspot.position.longitude,
            hotspot.message.content,
            hotspot.message.updatedAt.toUTCString(),
            hotspot.pertinence.nAgree,
            hotspot.pertinence.nDisagree,
            hotspot.type,
            hotspot.views,
            hotspot.address.city,
            hotspot.address.name,
            hotspot.author.id.toString(),
            hotspot.avatarIconUrl.toString(),
            hstoreConverter.stringify(MapToObject(hotspot.voterList.list)),
            hotspot.cityId.toString(),
        ];

        await this.postgre.query(query, values);
    }

    public async update(hotspot: Hotspot) {
        if (hotspot instanceof AlertHotspot) await this.updateAlert(hotspot);
        if (hotspot instanceof MediaHotspot) await this.updateMedia(hotspot);
    }

    public async updateAlert(hotspot: AlertHotspot) {
        const query = `
            UPDATE hotspots SET
                picture_description = $2, message_updated_at = $3, message_content = $4,
                pertinence_agree = $5, pertinence_disagree = $6, views = $7, voter_list = $8
            WHERE id = $1
        `;
        const values = [
            hotspot.id.toString(),
            hotspot.pictureDescription.toString(),
            hotspot.message.updatedAt.toUTCString(),
            hotspot.message.content.toString(),
            hotspot.pertinence.nAgree,
            hotspot.pertinence.nDisagree,
            hotspot.views,
            hstoreConverter.stringify(MapToObject(hotspot.voterList.list)),
        ];

        await this.postgre.query(query, values);
    }
    public async updateMedia(hotspot: MediaHotspot) {
        const query = `
            UPDATE hotspots
            SET members = $2, slideShow = $3, views = $4, title = $5, scope = $6, slug = $7, picture = $8
            WHERE id = $1
        `;
        const values = [
            hotspot.id.toString(),
            hotspot.members.toArray().map(x => x.toString()),
            hotspot.slideShow.list.map(x => x.toString()),
            hotspot.views,
            hotspot.title.toString(),
            hotspot.scope.toString(),
            slug(hotspot.title),
            hotspot.avatarIconUrl.toString(),
        ];

        await this.postgre.query(query, values);
    }
    public async delete(id: HotspotId) {
        const query = `
            UPDATE hotspots SET removed = true WHERE id = $1
        `;
        const values = [id.toString()];

        await this.postgre.query(query, values);
    }
    public async cacheAlgolia(id: HotspotId, v: boolean) {
        const query = `
            UPDATE hotspots SET cache_algolia = $1 WHERE id = $2
        `;
        const values = [v, id.toString()];

        await this.postgre.query(query, values);
    }
}
