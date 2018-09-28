import City from './City';

export default interface Territoire {
    trouverUneVilleParSlug(slug: string): Promise<City | undefined>;
};
