import CityId from '../../city/CityId';
import Hotspot from '../Hotspot';
import IHotspotRepository from '../IHotspotRepository';
import HotspotReducer from '../HotspotReducer';
import Cityzen from '../../cityzen/Cityzen';

export enum HotspotParCodeInseeStatus {
    OK = 'OK',
}

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
