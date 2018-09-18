import Cityzen from '../../cityzen/Cityzen';
import UseCaseStatus from './UseCaseStatus';
import HotspotRepositoryPostgreSQL from '../../../infrastructure/HotspotRepositoryPostgreSQL';
import Hotspot from '../Hotspot';
import HotspotFactory from '../HotspotFactory';

export interface INouveauHotspotParams {
    user: Cityzen;
    payload: any;
}

export interface INouveauHotspotResult {
    status: UseCaseStatus;
}

export interface INouveauHotspot {
    run(params: INouveauHotspotParams): Promise<INouveauHotspotResult>;
}

export default class NouveauHotspot implements INouveauHotspot {
    constructor(private repository: HotspotRepositoryPostgreSQL) {}

    async run(params: INouveauHotspotParams): Promise<INouveauHotspotResult> {
        params.payload.cityzen = params.user;
        const newHotspot: Hotspot = new HotspotFactory().build(params.payload);
        await this.repository.store(newHotspot);
        //
        return {
            status: UseCaseStatus.OK,
        };
    }
}
