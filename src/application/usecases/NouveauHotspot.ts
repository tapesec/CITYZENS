import Cityzen from '../domain/cityzen/Cityzen';
import UseCaseStatus from './UseCaseStatus';
import Hotspot from '../domain/hotspot/Hotspot';
import HotspotFactory from '../domain/hotspot/HotspotFactory';
import Carte from '../domain/hotspot/Carte';

export interface INouveauHotspotParams {
    user: Cityzen;
    payload: any;
}

export interface INouveauHotspotResult {
    status: UseCaseStatus;
    nouveauHotspot: Hotspot;
}

export interface INouveauHotspot {
    run(params: INouveauHotspotParams): Promise<INouveauHotspotResult>;
}

export default class NouveauHotspot implements INouveauHotspot {
    constructor(private carte: Carte) {}

    async run(params: INouveauHotspotParams): Promise<INouveauHotspotResult> {
        params.payload.cityzen = params.user;
        const nouveauHotspot: Hotspot = new HotspotFactory().build(params.payload);
        await this.carte.store(nouveauHotspot);
        return {
            nouveauHotspot,
            status: UseCaseStatus.OK,
        };
    }
}
