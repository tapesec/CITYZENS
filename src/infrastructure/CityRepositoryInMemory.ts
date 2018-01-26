import City from './../domain/cityLife/model/city/City';
import ICityRepository from './../domain/cityLife/model/city/ICityRepository';
const slugIt = require('slug');

class CityRepositoryInMemory implements ICityRepository {

    protected cities : Map<string, City> = new Map();

    public findByInsee(insee: string): City {
        return this.cities.get(insee);
    }
    public findBySlug(slug: string): City | undefined {
        let result : City | undefined = undefined;
        this.cities.forEach((v, k, m) => {
            if (slugIt(v.name) === slug) result = v;
        });
        return result;
    }
    public store(city: City): void {
        this.cities.set(city.insee, city);
    }
    public remove(insee: string): void {
        this.cities.delete(insee);
    }

}
export { CityRepositoryInMemory };
export default new CityRepositoryInMemory();
