import { isUuid } from '../../helpers/isUuid';
import Hotspot from '../domain/hotspot/Hotspot';
import Carte from '../domain/hotspot/Carte';
import HotspotId from '../domain/hotspot/HotspotId';
import Cityzen from '../domain/cityzen/Cityzen';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
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
    constructor(private carte: Carte) {}

    async run(params: HotspotParSlugOuIdParams): Promise<HotspotParSlugOuIdResult> {
        const hotspotId = isUuid(params.hotspotId as string)
            ? new HotspotId(params.hotspotId as string)
            : params.hotspotId;

        const hotspot = await (hotspotId instanceof HotspotId
            ? this.carte.findById(hotspotId)
            : this.carte.findBySlug(hotspotId));

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
