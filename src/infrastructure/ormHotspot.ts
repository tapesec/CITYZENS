import { hstoreConverter } from '../api/services/postgreSQL/hstoreConverter';
import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import CityId from '../domain/cityLife/model/city/CityId';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot, { HotspotType } from '../domain/cityLife/model/hotspot/Hotspot';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import MediaHotspot from '../domain/cityLife/model/hotspot/MediaHotspot';
import MapToObject from '../helpers/MapToObject';

export default class OrmHotspot {
    constructor(private postgre: PostgreSQL) {}

    private constructFromQuery(entry: any) {
        const author = {
            pseudo: entry['pseudo'],
            id: entry['user_id'],
            pictureExtern: entry['picture_extern'],
            pictureCityzen: entry['picture_cityzen'],
        };
        if (entry['type'] === HotspotType.Alert) {
            const hotspot = {
                position: {
                    latitude: entry['position_lat'],
                    longitude: entry['position_lon'],
                },
            };
        }
        if (entry['type'] === HotspotType.Media) {
            const hotspot = {};
        }

        const message = {
            author,
            id: entry.id,
            title: entry['title'],
            body: entry['body'],
            pinned: entry['pinned'],
            hotspotId: entry['hotspot_id'],
            createdAt: entry['created_at'],
            updateAt: entry['updated_at'],
            parentId: entry['parent_id'] === null ? undefined : entry['parent_id'],
        };
    }

    public async findByArea(north: number, south: number, west: number, east: number) {
        const query = `
            SELECT * from hotspots h JOIN cityzens c ON h.author_id = c.user_id
            WHERE h.position_lat <= $1 AND $2 <= h.position_lat AND
                  h.position_lon <= $3 AND $4 <= h.position_lon AND h.removed = false 
        `;

        const values = [north, south, west, east];

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
            'SELECT * from hotspots h JOIN cityzens c ON h.author_id = c.user_id WHERE id = $1';
        const values = [hotspotId.toString()];

        const result = await this.postgre.query(query, values);

        if (result.rowCount < 1) {
            return;
        }
        const entry = this.constructFromQuery(result.rows[0]);

        return entry;
    }
    public async save(hotspot: Hotspot) {
        if (hotspot instanceof MediaHotspot) this.saveMedia(hotspot);
        if (hotspot instanceof AlertHotspot) this.saveAlert(hotspot);
    }
    private async saveMedia(hotspot: MediaHotspot) {
        const query = `
            INSERT INTO hotspots (
                id, members, position_lat, position_lon, scope, slideshow, slug, city_id
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
        ];

        await this.postgre.query(query, values);
    }

    public async update(hotspot: Hotspot) {
        if (hotspot instanceof AlertHotspot) this.updateAlert(hotspot);
        if (hotspot instanceof MediaHotspot) this.updateMedia(hotspot);
    }

    public async updateAlert(hotspot: AlertHotspot) {
        const query = `
            UPDATE hotspots SET (
                picture_description, message_updated_at,
                pertinence_agree, pertinence_disagree, views, voter_list
            ) VALUES ($2, $3, $4, $5, $6, $7)
            WHERE id = $1
        `;
        const values = [
            hotspot.id,
            hotspot.pictureDescription.toString(),
            hotspot.message.updatedAt.toUTCString(),
            hotspot.pertinence.nAgree,
            hotspot.pertinence.nDisagree,
            hotspot.views,
            hstoreConverter.stringify(MapToObject(hotspot.voterList.list)),
        ];

        await this.postgre.query(query, values);
    }
    public async updateMedia(hotspot: MediaHotspot) {
        const query = `
            UPDATE hotspots SET (
                members, slideShow, views
            ) VALUES ($2, $3, $4)
            WHERE id = $1
        `;
        const values = [
            hotspot.id,
            hotspot.members.toArray().map(x => x.toString()),
            hotspot.slideShow.list.map(x => x.toString()),
            hotspot.views,
        ];

        await this.postgre.query(query, values);
    }
    public async delete(id: HotspotId) {
        const query = `
            UPDATES hotspots SET removed = false WHERE id = $1
        `;
        const values = [id.toString()];

        await this.postgre.query(query, values);
    }
}
