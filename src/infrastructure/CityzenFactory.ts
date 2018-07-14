import ImageLocation from '../domain/cityLife/model/hotspot/ImageLocation';
import Cityzen from '../domain/cityzens/model/Cityzen';
import CityzenId from '../domain/cityzens/model/CityzenId';

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
            'No description available',
            new ImageLocation(data.picture_extern),
            new ImageLocation(data.picture_cityzen),
        );
    }
}
