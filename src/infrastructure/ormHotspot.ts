import { hotspotCollection } from './dbInMemory';

import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import CityId from '../domain/cityLife/model/city/CityId';
import Hotspot from '../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from '../domain/cityLife/model/hotspot/MediaHotspot';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';

export default class OrmHotspot {
    constructor(private postgre: PostgreSQL) {}

    private constructFromQuery(entry: any) {}

    public async findByArea(nort: number, south: number, west: number, east: number) {}
    public async findByCity(cityId: CityId) {}

    public async findOne(hotspotId: HotspotId) {
        const query =
            'SELECT * from hotspots h JOIN cityzens c ON h.author_id = c.user_id WHERE id = $1';
        const values = [hotspotId.toString()];

        const result = await this.postgre.query(query, values);

        if (result.rowCount < 1) {
            return;
        }
        const entry = result.rows[0];

        return entry;
    }
    public async save(hotspot: Hotspot) {
        if (hotspot instanceof MediaHotspot) this.saveMedia(hotspot);
        if (hotspot instanceof AlertHotspot) this.saveAlert(hotspot);
    }
    private async saveMedia(hotspot: MediaHotspot) {}
    private async saveAlert(hotspot: AlertHotspot) {}

    public async update(hotspot: Hotspot) {}
    public async delete(id: HotspotId) {}
}
