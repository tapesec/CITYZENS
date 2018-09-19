import CityId from '../city/CityId';
import AlertHotspot from './AlertHotspot';
import Hotspot from './Hotspot';
import HotspotId from './HotspotId';
import MediaHotspot from './MediaHotspot';

interface Carte {
    findById(id: HotspotId): Promise<MediaHotspot | AlertHotspot>;
    findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(MediaHotspot | AlertHotspot)[]>;
    findByCodeCommune(insee: CityId): Promise<(MediaHotspot | AlertHotspot)[]>;
    isSet(id: HotspotId): Promise<boolean>;
    isSetBySlug(slug: String): Promise<boolean>;
    store(hotspot: Hotspot): void;
    remove(id: HotspotId): void;
    findBySlug(slug: String): Promise<MediaHotspot | AlertHotspot>;
    cacheAlgolia(id: HotspotId, v: boolean): Promise<any>;
    update(hotspot: Hotspot): Promise<any>;
}

export default Carte;
