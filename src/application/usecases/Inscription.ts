import CityzenFactory from '../domain/cityzen/CityzenFactory';
import ICityzenRepository from '../domain/cityzen/ICityzenRepository';
import { inscrisHabitantStatus } from '../../infrastructure/CityzenRepositoryPostgreSQL';
import UseCaseStatus from './UseCaseStatus';
import Cityzen from '../domain/cityzen/Cityzen';

export interface InscriptionParametre {
    email: string;
    password: string;
    username: string;
}
export interface InscriptionResultat {
    status: UseCaseStatus;
    newCityzen?: Cityzen;
}

class Inscription {
    constructor(protected population: ICityzenRepository) {}
    public async run(params: InscriptionParametre) {
        const cityzen = new CityzenFactory().build(params);
        const status = await this.population.inscrisHabitant(cityzen, params.password);
        if (status === inscrisHabitantStatus.EXISTE_DEJA) {
            return {
                status: UseCaseStatus.ALREADY_SIGN_UP,
            };
        }
        return {
            status: UseCaseStatus.OK,
            newCityzen: cityzen,
        };
    }
}

export default Inscription;
