import Cityzen from '../domain/cityzen/Cityzen';
import HotspotId from '../domain/hotspot/HotspotId';
import UseCaseStatus from './UseCaseStatus';
import Carte from '../domain/hotspot/Carte';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';

export interface SupprimerHotspotParametres {
    user: Cityzen;
    hotspotId: HotspotId;
}

class SupprimerUnHotspot {
    constructor(protected carte: Carte) {}
    async run(params: SupprimerHotspotParametres): Promise<UseCaseStatus> {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return UseCaseStatus.NOT_FOUND;
        }
        if (!isAuthorized.toRemoveHotspot(hotspot, params.user)) {
            return UseCaseStatus.NOT_OWNER_NOR_GRANTED;
        }
        await this.carte.remove(params.hotspotId);
        return UseCaseStatus.OK;
    }
}

export default SupprimerUnHotspot;
