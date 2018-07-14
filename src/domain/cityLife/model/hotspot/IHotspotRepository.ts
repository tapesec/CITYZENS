import CityId from '../city/CityId';
import AlertHotspot from './AlertHotspot';
import Hotspot from './Hotspot';
import HotspotId from './HotspotId';
import MediaHotspot from './MediaHotspot';

interface IHotspotRepository {
    findById(id: HotspotId): Promise<MediaHotspot | AlertHotspot>;

    findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(MediaHotspot | AlertHotspot)[]>;

    findByCodeCommune(insee: CityId): Promise<(MediaHotspot | AlertHotspot)[]>;

    isSet(id: HotspotId): Promise<boolean>;

    store(hotspot: Hotspot): void;

    remove(id: HotspotId): void;
}

export default IHotspotRepository;
