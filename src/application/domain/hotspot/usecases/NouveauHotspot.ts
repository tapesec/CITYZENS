import Cityzen from '../../cityzen/Cityzen';
import UseCaseStatus from './UseCaseStatus';
import Hotspot from '../Hotspot';
import HotspotFactory from '../HotspotFactory';
import IHotspotRepository from '../IHotspotRepository';

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
    constructor(private repository: IHotspotRepository) {}

    async run(params: INouveauHotspotParams): Promise<INouveauHotspotResult> {
        params.payload.cityzen = params.user;
        const nouveauHotspot: Hotspot = new HotspotFactory().build(params.payload);
        await this.repository.store(nouveauHotspot);
        return {
            nouveauHotspot,
            status: UseCaseStatus.OK,
        };
    }
}
