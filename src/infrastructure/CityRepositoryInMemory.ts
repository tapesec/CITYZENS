import City from '../domain/cityLife/model/City';
import { Error } from 'tslint/lib/error';
import ICityRepository from '../domain/cityLife/model/ICityRepository';

class CityRepositoryInMemory implements ICityRepository {

    protected citys : Map<string, City> = new Map();
    
    public findByInsee(insee: string): City {
        return this.citys.get(insee);
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
