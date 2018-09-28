import City from '../application/domain/city/City';
import Territoire from '../application/domain/city/Territoire';
import { PostgreSQL } from './libs/postgreSQL/postgreSQL';
import Position from '../application/domain/hotspot/Position';
const slugIt = require('slug');

class CityRepositoryPostgreSQL implements Territoire {
    protected cities: Map<string, City> = new Map();

    constructor(protected pg: PostgreSQL) {}
    public async trouverUneVilleParSlug(slug: string): Promise<City | undefined> {
        const results = await this.pg.query('SELECT * from citys WHERE slug = $1', [slug]);
        if (results.rowCount === 0) {
            return undefined;
        }
        const data = results.rows[0];
        const polygon = data.polygon.map(
            (coords: any) => new Position(coords.latitude, coords.longitude),
        );
        const city = new City(
            data.name,
            data.insee,
            data.postalcode,
            new Position(data.position_lat, data.position_lon),
            polygon,
            data.slug,
            data.created_at,
            data.updated_at,
        );
        return city;
    }
}
export default CityRepositoryPostgreSQL;
