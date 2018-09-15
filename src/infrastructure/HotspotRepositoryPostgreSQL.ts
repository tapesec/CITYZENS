import CityId from '../domain/model/CityId';
import AlertHotspot from '../domain/model/AlertHotspot';
import Hotspot from '../domain/model/Hotspot';
import HotspotId from '../domain/model/HotspotId';
import IHotspotRepository from '../domain/interface/IHotspotRepository';
import MediaHotspot from '../domain/model/MediaHotspot';
import HotspotFactory from './HotspotFactory';
import OrmHotspot from './ormHotspot';

class HotspotRepositoryInMemory implements IHotspotRepository {
    constructor(protected orm: OrmHotspot, private factory: HotspotFactory) {}

    public async findByCodeCommune(
        insee: CityId,
        onError: (exception: Error) => void,
    ): Promise<(MediaHotspot | AlertHotspot)[]> {
        const data = await this.orm.findByCity(insee);
        return data
            .map(x => {
                try {
                    return this.factory.build(x);
                } catch (error) {
                    onError(error);
                    return undefined;
                }
            })
            .filter(x => x !== undefined);
    }

    public async findById(id: HotspotId): Promise<MediaHotspot | AlertHotspot> {
        const data = await this.orm.findOne(id);
        if (data === undefined) return undefined;

        return this.factory.build(data);
    }
    public async findBySlug(slug: String): Promise<MediaHotspot | AlertHotspot> {
        const data = await this.orm.findBySlug(slug);
        if (data === undefined) return undefined;

        return this.factory.build(data);
    }

    public async isSet(id: HotspotId): Promise<boolean> {
        const data = await this.orm.findOne(id);
        return data !== undefined;
    }

    public async isSetBySlug(slug: String): Promise<boolean> {
        const data = await this.orm.findBySlug(slug);
        return data !== undefined;
    }

    public async findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
        onError: (error: Error) => void,
    ): Promise<(MediaHotspot | AlertHotspot)[]> {
        const data = await this.orm.findByArea(north, west, south, east);

        return data.map(x => {
            try {
                return this.factory.build(x);
            } catch (error) {
                onError(error);
                return undefined;
            }
        });
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
}

export default HotspotRepositoryInMemory;
