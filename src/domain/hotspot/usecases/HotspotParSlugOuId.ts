import Hotspot from '../Hotspot';
import IHotspotRepository from '../IHotspotRepository';
import HotspotId from '../HotspotId';
import Cityzen from '../../cityzen/Cityzen';
import * as isAuthorized from '../services/isAuthorized';
import UseCaseStatus from './UseCaseStatus';

export interface IHotspotParSlugOuId {
    run(params: HotspotParSlugOuIdParams): Promise<HotspotParSlugOuIdResult>;
}

export interface HotspotParSlugOuIdParams {
    user?: Cityzen;
    hotspotId: HotspotId | string;
}

export interface HotspotParSlugOuIdResult {
    status: UseCaseStatus;
    hotspot?: Hotspot;
}

export default class HotspotParSlugOuId implements IHotspotParSlugOuId {
    constructor(private repository: IHotspotRepository) {}

    async run(params: HotspotParSlugOuIdParams): Promise<HotspotParSlugOuIdResult> {
        const hotspotId =
            typeof params.hotspotId === 'string'
                ? new HotspotId(params.hotspotId)
                : params.hotspotId;

        const hotspot = await (hotspotId instanceof HotspotId
            ? this.repository.findById(hotspotId)
            : this.repository.findBySlug(hotspotId));

        if (!hotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        if (!isAuthorized.toSeeHotspot(hotspot, params.user)) {
            return {
                status: UseCaseStatus.UNAUTHORIZED,
            };
        }
        return {
            hotspot,
            status: UseCaseStatus.OK,
        };
    }
}
