import UseCaseStatus from './UseCaseStatus';
import City from '../domain/city/City';
import Territoire from '../domain/city/Territoire';

export interface VilleParSlugResultat {
    status: UseCaseStatus;
    city?: City;
}

class VilleParSlug {
    constructor(protected territoire: Territoire) {}
    public async run(slug: string) {
        const ville = await this.territoire.trouverUneVilleParSlug(slug);
        if (!ville) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        return {
            status: UseCaseStatus.OK,
            city: ville,
        };
    }
}
export default VilleParSlug;
