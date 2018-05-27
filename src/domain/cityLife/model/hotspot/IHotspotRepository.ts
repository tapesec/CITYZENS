import AlertHotspot from './AlertHotspot';
import EventHotspot from './EventHotspot';
import Hotspot from './Hotspot';
import WallHotspot from './WallHotspot';

interface IHotspotRepository {
    findById(id: string): Promise<WallHotspot | EventHotspot | AlertHotspot>;

    findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(WallHotspot | EventHotspot | AlertHotspot)[]>;

    findByCodeCommune(insee: string): Promise<(WallHotspot | EventHotspot | AlertHotspot)[]>;

    isSet(id: string): boolean;

    store(hotspot: Hotspot): void;

    remove(id: string): void;
}

export default IHotspotRepository;
