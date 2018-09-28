import City from './City';

export default interface Territoire {
    trouverUneVilleParCodeInsee(insee: string): City;
    conquerirUneVille(city: City): void;
    detruireUneVille(insee: string): void;
    trouverUneVilleParSlug(slug: string): Promise<City | undefined>;
};
