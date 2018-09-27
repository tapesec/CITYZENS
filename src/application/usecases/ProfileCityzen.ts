import CityzenId from '../domain/cityzen/CityzenId';
import Cityzen from '../domain/cityzen/Cityzen';
import UseCaseStatus from './UseCaseStatus';
import ICityzenRepository from '../domain/cityzen/ICityzenRepository';

export interface ProfileCityzenParemetres {
    cityzenId: CityzenId;
}

export interface ProfileCityzenResultat {
    cityzen?: Cityzen;
    status: UseCaseStatus;
}

class ProfileCityzen {
    constructor(protected population: ICityzenRepository) {}
    public async run(params: ProfileCityzenParemetres): Promise<ProfileCityzenResultat> {
        const cityzen = await this.population.findById(params.cityzenId);
        if (cityzen === undefined) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        return {
            cityzen,
            status: UseCaseStatus.OK,
        };
    }
}

export default ProfileCityzen;
