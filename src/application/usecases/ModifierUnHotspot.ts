import Cityzen from '../domain/cityzen/Cityzen';
import HotspotId from '../domain/hotspot/HotspotId';
import Hotspot from '../domain/hotspot/Hotspot';
import UseCaseStatus from './UseCaseStatus';
import Carte from '../domain/hotspot/Carte';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import modifieHotspot from '../domain/hotspot/modifieHotspot';

export interface ParametreModifierUnHotspot {
    user: Cityzen;
    hotspotId: HotspotId;
    payload: any;
}

export interface ResultatModifierUnHotspot {
    hotspot?: Hotspot;
    status: UseCaseStatus;
}

class ModifierUnHotspot {
    constructor(private carte: Carte) {}
    async run(params: ParametreModifierUnHotspot): Promise<ResultatModifierUnHotspot> {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        if (!isAuthorized.toPatchHotspot(hotspot, params.user)) {
            return {
                status: UseCaseStatus.NOT_OWNER_NOR_GRANTED,
            };
        }
        if (params.payload.slideShow) {
            await this.carte.removeSlideshowImagesFromHotspot(hotspot, params.payload.slideShow);
        }
        const hotspotToUpdate: Hotspot = modifieHotspot(hotspot, params.payload);
        await this.carte.update(hotspotToUpdate);
        return {
            status: UseCaseStatus.OK,
            hotspot: hotspotToUpdate,
        };
    }
}

export default ModifierUnHotspot;
