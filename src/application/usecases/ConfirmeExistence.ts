import HotspotId from '../domain/hotspot/HotspotId';
import UseCaseStatus from './UseCaseStatus';
import Carte from '../domain/hotspot/Carte';
import Hotspot from '../domain/hotspot/Hotspot';
import AlertHotspot from '../domain/hotspot/AlertHotspot';
import Cityzen from '../domain/cityzen/Cityzen';
import CityzenId from '../domain/cityzen/CityzenId';

export interface ConfirmeExistenceParametres {
    user: Cityzen;
    hotspotId: HotspotId;
    confirme: boolean;
}
export interface ConfirmeExistenceResultat {
    status: UseCaseStatus;
    hotspot?: Hotspot;
}
export interface ConfirmeExistence {
    run(params: ConfirmeExistenceParametres): Promise<ConfirmeExistenceResultat>;
}

export default class Existence {
    constructor(private carte: Carte) {}

    async run(params: ConfirmeExistenceParametres) {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        if (!(hotspot instanceof AlertHotspot)) {
            return {
                status: UseCaseStatus.UNAUTHORIZED,
            };
        }
        const cityzenId: CityzenId = params.user.id;
        if (hotspot.voterList.has(cityzenId)) {
            return {
                status: UseCaseStatus.ALREADY_VOTED,
            };
        }
        hotspot.addVoter(cityzenId, params.confirme);
        await this.carte.update(hotspot);
        return {
            hotspot,
            status: UseCaseStatus.VOTED,
        };
    }
}
