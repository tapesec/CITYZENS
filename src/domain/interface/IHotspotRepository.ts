import CityId from '../model/CityId';
import AlertHotspot from '../model/AlertHotspot';
import Hotspot from '../model/Hotspot';
import HotspotId from '../model/HotspotId';
import MediaHotspot from '../model/MediaHotspot';

interface IHotspotRepository {
    findById(id: HotspotId): Promise<MediaHotspot | AlertHotspot>;

    findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
        onError: (exception: Error) => void,
    ): Promise<(MediaHotspot | AlertHotspot)[]>;

    findByCodeCommune(
        insee: CityId,
        onError: (exception: Error) => void,
    ): Promise<(MediaHotspot | AlertHotspot)[]>;

    isSet(id: HotspotId): Promise<boolean>;

    store(hotspot: Hotspot): void;

    remove(id: HotspotId): void;
}

export default IHotspotRepository;
