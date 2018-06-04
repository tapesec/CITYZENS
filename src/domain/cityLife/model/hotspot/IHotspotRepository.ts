import AlertHotspot from './AlertHotspot';
import Hotspot from './Hotspot';
import MediaHotspot from './MediaHotspot';

interface IHotspotRepository {
    findById(id: string): Promise<MediaHotspot | AlertHotspot>;

    findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(MediaHotspot | AlertHotspot)[]>;

    findByCodeCommune(insee: string): Promise<(MediaHotspot | AlertHotspot)[]>;

    isSet(id: string): boolean;

    store(hotspot: Hotspot): void;

    remove(id: string): void;
}

export default IHotspotRepository;
