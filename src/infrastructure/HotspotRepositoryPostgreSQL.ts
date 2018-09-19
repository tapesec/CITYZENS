import CityId from '../domain/city/CityId';
import AlertHotspot from '../domain/hotspot/AlertHotspot';
import Hotspot from '../domain/hotspot/Hotspot';
import HotspotId from '../domain/hotspot/HotspotId';
import IHotspotRepository from '../domain/hotspot/IHotspotRepository';
import MediaHotspot from '../domain/hotspot/MediaHotspot';
import HotspotFactory from '../domain/hotspot/HotspotFactory';
import OrmHotspot from './ormHotspot';
import Algolia from '../api/services/algolia/Algolia';
import { MCDVLogger, getlogger, MCDVLoggerEvent } from '../api/libs/MCDVLogger';

class HotspotRepositoryPostgreSQL implements IHotspotRepository {
    private factory: HotspotFactory;
    private logger: MCDVLogger;

    constructor(protected orm: OrmHotspot, protected algolia: Algolia) {
        this.factory = new HotspotFactory();
        this.logger = getlogger();
    }

    public async findByCodeCommune(insee: CityId): Promise<(MediaHotspot | AlertHotspot)[]> {
        const data = await this.orm.findByCity(insee);
        return data
            .map(x => {
                try {
                    return this.factory.build(x);
                } catch (error) {
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
    ): Promise<(MediaHotspot | AlertHotspot)[]> {
        const data = await this.orm.findByArea(north, west, south, east);

        return data.map(x => {
            try {
                return this.factory.build(x);
            } catch (error) {
                return undefined;
            }
        });
    }

    public async store(hotspot: Hotspot) {
        await this.orm.save(hotspot);
        try {
            await this.algolia.addHotspot(hotspot);
            await this.orm.cacheAlgolia(hotspot.id, true);
            this.logger.debug(
                MCDVLoggerEvent.ALGOLIA_SYNC_SUCCESS,
                `Algolia index synchronized for hotspotId : ${hotspot.id}`,
            );
        } catch (error) {
            await this.orm.cacheAlgolia(hotspot.id, false);
            this.logger.error(MCDVLoggerEvent.ALGOLIA_SYNC_FAILED, error.message);
        }
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

export default HotspotRepositoryPostgreSQL;
