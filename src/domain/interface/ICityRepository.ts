import City from '../model/City';

export default interface ICityRepository {
    findByInsee(insee: string): City;

    store(city: City): void;

    remove(insee: string): void;
};
