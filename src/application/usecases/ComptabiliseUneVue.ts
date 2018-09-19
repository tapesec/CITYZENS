import UseCaseStatus from './UseCaseStatus';
import HotspotId from '../domain/hotspot/HotspotId';
import Carte from '../domain/hotspot/Carte';
import Hotspot from '../domain/hotspot/Hotspot';

export interface ComptabiliseUneVue {
    run(hotspotId: HotspotId): Promise<ComptabiliseUneVueResult>;
}

export interface ComptabiliseUneVueResult {
    status: UseCaseStatus;
    hotspot: Hotspot;
}

export default class CompteUneVue implements ComptabiliseUneVue {
    constructor(protected carte: Carte) {}

    async run(hotspotId: HotspotId): Promise<ComptabiliseUneVueResult> {
        const visitedHotspot = await this.carte.findById(hotspotId);
        visitedHotspot.countOneMoreView();
        await this.carte.update(visitedHotspot);
        return {
            status: UseCaseStatus.OK,
            hotspot: visitedHotspot,
        };
    }
}
