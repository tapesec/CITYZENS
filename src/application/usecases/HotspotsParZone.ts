import Hotspot from '../domain/hotspot/Hotspot';
import Carte from '../domain/hotspot/Carte';
import HotspotReducer from '../domain/hotspot/HotspotReducer';
import MediaHotspot from '../domain/hotspot/MediaHotspot';
import AlertHotspot from '../domain/hotspot/AlertHotspot';
import Cityzen from '../domain/cityzen/Cityzen';

class HotspotsParZone implements IHotspotsParZone {
    constructor(private carte: Carte) {}

    async run(params: ParametresHotspotParZone): Promise<Hotspot[]> {
        const hotspots: (MediaHotspot | AlertHotspot)[] = await this.carte.findInArea(
            params.north,
            params.west,
            params.south,
            params.east,
        );
        const hotspotReducer = new HotspotReducer(hotspots);
        const visibleHotspots = hotspotReducer.renderVisibleHotspotsByVisitorStatus(params.user);
        return visibleHotspots;
    }
}

export default HotspotsParZone;

export enum HotspotParZoneStatus {
    OK = 'OK',
}

export interface ParametresHotspotParZone {
    north: number;
    south: number;
    east: number;
    west: number;
    user: Cityzen;
}

export interface IHotspotParZoneResult {
    status: HotspotParZoneStatus;
    hotspots: Hotspot[];
}

export interface IHotspotsParZone {
    run(params: ParametresHotspotParZone): Promise<Hotspot[]>;
}
