import City from './City';

export default interface ICityRepository {

    findByInsee(insee : string) : City;

    store(city : City) : void;

    remove(insee : string) : void;
}
