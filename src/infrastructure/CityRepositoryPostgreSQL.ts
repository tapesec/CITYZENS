import City from '../application/domain/city/City';
import Territoire from '../application/domain/city/ICityRepository';
const slugIt = require('slug');

class CityRepositoryPostgreSQL implements Territoire {
    protected cities: Map<string, City> = new Map();

    public trouverUneVilleParCodeInsee(insee: string): City {
        return this.cities.get(insee);
    }
    public trouverUneVilleParSlug(slug: string): City | undefined {
        let result: City | undefined = undefined;
        this.cities.forEach((v, k, m) => {
            if (slugIt(v.name) === slug) result = v;
        });
        return result;
    }
    public conquerirUneVille(city: City): void {
        this.cities.set(city.insee, city);
    }
    public detruireUneVille(insee: string): void {
        this.cities.delete(insee);
    }
}
export { CityRepositoryPostgreSQL };
export default new CityRepositoryPostgreSQL();
