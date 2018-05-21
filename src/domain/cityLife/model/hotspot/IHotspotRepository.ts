import AlertHotspot from './AlertHotspot';
import Hotspot from './Hotspot';
import WallHotspot from './WallHotspot';
import MediaHotspot from './MediaHotspot';

interface IHotspotRepository {
    findById(id: string): Promise<WallHotspot | MediaHotspot | AlertHotspot>;

    findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(WallHotspot | MediaHotspot | AlertHotspot)[]>;

    findByCodeCommune(insee: string): Promise<(WallHotspot | MediaHotspot | AlertHotspot)[]>;

    isSet(id: string): boolean;

    store(hotspot: Hotspot): void;

    remove(id: string): void;
}

export default IHotspotRepository;
