import { isUuid } from '../../helpers/isUuid';
import Hotspot from '../domain/hotspot/Hotspot';
import IHotspotRepository from '../domain/hotspot/IHotspotRepository';
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
    constructor(private repository: IHotspotRepository) {}

    async run(params: HotspotParSlugOuIdParams): Promise<HotspotParSlugOuIdResult> {
        const hotspotId = isUuid(params.hotspotId as string)
            ? new HotspotId(params.hotspotId as string)
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
