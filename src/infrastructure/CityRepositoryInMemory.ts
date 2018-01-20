import City from '../domain/cityLife/model/city/City';
import ICityRepository from '../domain/cityLife/model/city/ICityRepository';

class CityRepositoryInMemory implements ICityRepository {

    protected citys : Map<string, City> = new Map();

    public findByInsee(insee: string): City {
        return this.citys.get(insee);
    }
    public findBySlug(slug: string): City | undefined {
        let result : City | undefined = undefined;
        this.citys.forEach((v, k, m) => {
            if (v.name === slug) result = v;
        });
        return result;
    }
    public store(city: City): void {
        this.citys.set(city.insee, city);
    }
    public remove(insee: string): void {
        this.citys.delete(insee);
    }

}
export { CityRepositoryInMemory };
export default new CityRepositoryInMemory();
