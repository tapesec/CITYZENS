import CityzenId from '../domain/cityzen/CityzenId';
import UseCaseStatus from './UseCaseStatus';
import Cityzen from '../domain/cityzen/Cityzen';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import ICityzenRepository from '../domain/cityzen/ICityzenRepository';
import metAJourCityzen from '../domain/cityzen/services/metAJourCityzen';

export interface MettreAJourProfileCityzenParametres {
    cityzenId: CityzenId;
    user: Cityzen;
    payload: any;
}
export interface MettreAJourProfileCityzenResultat {
    status: UseCaseStatus;
    cityzenUpdated: Cityzen;
}

class MettreAJourProfileCityzen {
    constructor(protected population: ICityzenRepository) {}
    public async run(params: MettreAJourProfileCityzenParametres) {
        if (!isAuthorized.toUpdateCityzen(params.user, params.cityzenId)) {
            return {
                status: UseCaseStatus.UNAUTHORIZED,
            };
        }
        const cityzenToUpdate = await this.population.findById(params.cityzenId);
        if (!cityzenToUpdate) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        const cityzenUpdated = metAJourCityzen(cityzenToUpdate, params.payload);
        await this.population.updateCityzen(cityzenUpdated);
        return {
            cityzenUpdated,
            status: UseCaseStatus.OK,
        };
    }
}
export default MettreAJourProfileCityzen;
