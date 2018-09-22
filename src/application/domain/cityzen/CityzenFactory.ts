import ImageLocation from '../hotspot/ImageLocation';
import Cityzen from './Cityzen';
import CityzenId from './CityzenId';

export default class CityzenFactory {
    constructor() {}

    // data _must_ be from PostgreSQL db.
    public build(data: any): Cityzen {
        return new Cityzen(
            new CityzenId(data.user_id),
            data.email,
            data.pseudo,
            data.is_admin,
            new Set<string>(data.favorites_hotspots),
            data.description,
            new ImageLocation(data.picture_extern),
            new ImageLocation(data.picture_cityzen),
            data.created_at,
        );
    }
}