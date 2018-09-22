import UseCaseStatus from './UseCaseStatus';
import HotspotId from '../domain/hotspot/HotspotId';
import Carte from '../domain/hotspot/Carte';
import Hotspot from '../domain/hotspot/Hotspot';

export interface ComptabiliseUneVue {
    run(hotspotId: string): Promise<ComptabiliseUneVueResult>;
}

export interface ComptabiliseUneVueResult {
    status: UseCaseStatus;
    hotspot?: Hotspot;
}

export default class CompteUneVue implements ComptabiliseUneVue {
    constructor(protected carte: Carte) {}

    async run(hotspotId: string): Promise<ComptabiliseUneVueResult> {
        const id = new HotspotId(hotspotId);
        const visitedHotspot = await this.carte.findById(id);
        if (!visitedHotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        visitedHotspot.countOneMoreView();
        await this.carte.update(visitedHotspot);
        return {
            status: UseCaseStatus.OK,
            hotspot: visitedHotspot,
        };
    }
}
