import Hotspot from '../Hotspot';
import IHotspotRepository from '../IHotspotRepository';
import HotspotId from '../HotspotId';
import Cityzen from '../../cityzen/Cityzen';
import * as isAuthorized from '../services/isAuthorized';

export interface IHotspotParSlugOuId {
    run: {
        (params: HotspotParIdParams): Promise<HotspotParSlugOuIdResult>;
        (params: HotspotParSlugParams): Promise<HotspotParSlugOuIdResult>;
    };
}

export interface HotspotParIdParams {
    user: Cityzen;
    hotspotId: HotspotId;
}

export interface HotspotParSlugParams {
    user: Cityzen;
    slug: string;
}

export enum HotspotParSlugOuIdResultStatus {
    OK = 'OK',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface HotspotParSlugOuIdResult {
    status: HotspotParSlugOuIdResultStatus;
    hotspot?: Hotspot;
}

export default class HotspotParSlugOuId implements IHotspotParSlugOuId {
    constructor(private repository: IHotspotRepository) {}

    async run(params: HotspotParIdParams): Promise<HotspotParSlugOuIdResult> {
        // const isSet = await this.repository.isSet(hotspotId);
        const hotspot = await this.repository.findById(params.hotspotId);
        if (!hotspot) {
            return {
                status: HotspotParSlugOuIdResultStatus.NOT_FOUND,
            };
        }
        if (!isAuthorized.toSeeHotspot(hotspot, params.user)) {
            return {
                status: HotspotParSlugOuIdResultStatus.UNAUTHORIZED,
            };
        }
        return {
            hotspot,
            status: HotspotParSlugOuIdResultStatus.OK,
        };
    }

    // async run(params: HotspotParSlugParams) {}
}
