import CityId from '../domain/cityLife/model/city/CityId';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot from '../domain/cityLife/model/hotspot/Hotspot';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import IHotspotRepository from '../domain/cityLife/model/hotspot/IHotspotRepository';
import MediaHotspot from '../domain/cityLife/model/hotspot/MediaHotspot';
import { isUuid } from './../api/helpers';
import HotspotFactory from './HotspotFactory';
import OrmCityzen from './ormCityzen';
import OrmHotspot from './ormHotspot';

class HotspotRepositoryInMemory implements IHotspotRepository {
    protected hotspots: Map<string, Hotspot> = new Map();

    constructor(protected orm: OrmHotspot, protected ormCityzen: OrmCityzen) {}

    public async findByCodeCommune(insee: CityId): Promise<(MediaHotspot | AlertHotspot)[]> {
        const data = await this.orm.findByCity(insee);
        const factory = new HotspotFactory();
        return data.map(factory.build);
    }

    public async findById(id: HotspotId): Promise<MediaHotspot | AlertHotspot> {
        const data = await this.orm.findOne(id);
        const factory = new HotspotFactory();
        return factory.build(data);
    }

    public async isSet(id: HotspotId): Promise<boolean> {
        const data = await this.orm.findOne(id);
        return data !== undefined;
    }

    public async findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(MediaHotspot | AlertHotspot)[]> {
        const data = await this.orm.findByArea(north, west, south, east);
        const facoty = new HotspotFactory();
        return data.map(facoty.build);
    }

    public async store(hotspot: Hotspot) {
        await this.orm.save(hotspot);
    }

    public async update(hotspot: Hotspot) {
        await this.orm.update(hotspot);
    }

    public async remove(hotspotId: HotspotId) {
        await this.orm.delete(hotspotId);
    }

    public async cacheAlgolia(id: HotspotId, v: boolean) {
        await this.orm.cacheAlgolia(id, v);
    }

    private buildRequestBySlugOrId = (id: string) => {
        const isId = isUuid(id);
        if (isId) {
            return {
                id,
                removed: false,
            };
        }
        return {
            slug: id,
            removed: false,
        };
    };
}

export default HotspotRepositoryInMemory;
