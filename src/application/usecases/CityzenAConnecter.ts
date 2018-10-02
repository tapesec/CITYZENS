import ICityzenRepository from '../domain/cityzen/ICityzenRepository';
import UseCaseStatus from './UseCaseStatus';
import Cityzen from '../domain/cityzen/Cityzen';

export interface CityzenAConnecterResultat {
    cityzen?: Cityzen;
    status: UseCaseStatus;
}

class CityzenAConnecter {
    constructor(protected population: ICityzenRepository) {}
    public async run(email: string, password: string): Promise<CityzenAConnecterResultat> {
        const cityzen: Cityzen = await this.population.habitantInscris(email, password);
        if (!cityzen) {
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
export default CityzenAConnecter;
