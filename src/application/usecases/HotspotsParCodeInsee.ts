import CityId from '../domain/city/CityId';
import Hotspot from '../domain/hotspot/Hotspot';
import IHotspotRepository from '../domain/hotspot/IHotspotRepository';
import HotspotReducer from '../domain/hotspot/HotspotReducer';
import Cityzen from '../domain/cityzen/Cityzen';

export interface ParametresHotspotParCodeInsee {
    cityId: CityId;
    user: Cityzen;
}

export interface IHotspotsParCodeInsee {
    run(params: ParametresHotspotParCodeInsee): Promise<Hotspot[]>;
}

export default class HotspotsParCodeInsee implements IHotspotsParCodeInsee {
    constructor(private hotspotRepo: IHotspotRepository) {}

    async run(params: ParametresHotspotParCodeInsee): Promise<Hotspot[]> {
        const hotspots = await this.hotspotRepo.findByCodeCommune(params.cityId);
        const hotspotReducer = new HotspotReducer(hotspots);
        const visibleHotspots = hotspotReducer.renderVisibleHotspotsByVisitorStatus(params.user);
        return visibleHotspots;
    }
}
