import Hotspot from '../Hotspot';
import IHotspotRepository from '../IHotspotRepository';
import HotspotReducer from '../HotspotReducer';
import MediaHotspot from '../MediaHotspot';
import AlertHotspot from '../AlertHotspot';
import Cityzen from '../../cityzen/Cityzen';

class HotspotParZone implements IHotspotParZone {
    constructor(private hotspotRepo: IHotspotRepository) {}

    async run(params: ParametresHotspotParZone): Promise<Hotspot[]> {
        const hotspots: (MediaHotspot | AlertHotspot)[] = await this.hotspotRepo.findInArea(
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

export default HotspotParZone;

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

export interface IHotspotParZone {
    run(params: ParametresHotspotParZone): Promise<Hotspot[]>;
}
