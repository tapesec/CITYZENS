import CityId from '../application/domain/city/CityId';
import AlertHotspot from '../application/domain/hotspot/AlertHotspot';
import Hotspot from '../application/domain/hotspot/Hotspot';
import HotspotId from '../application/domain/hotspot/HotspotId';
import MediaHotspot from '../application/domain/hotspot/MediaHotspot';
import HotspotFactory from '../application/domain/hotspot/HotspotFactory';
import Carte from '../application/domain/hotspot/Carte';

import OrmHotspot from './ormHotspot';
import Algolia from '../api/services/algolia/Algolia';
import { MCDVLogger, getlogger, MCDVLoggerEvent } from '../api/libs/MCDVLogger';
import SlideshowService from '../api/services/widgets/SlideshowService';

class HotspotRepositoryPostgreSQL implements Carte {
    private factory: HotspotFactory;
    private logger: MCDVLogger;

    constructor(
        protected orm: OrmHotspot,
        protected algolia: Algolia,
        protected slideshow: SlideshowService,
    ) {
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
        try {
            await this.algolia.addHotspot(hotspot);
            this.orm.cacheAlgolia(hotspot.id, true);
        } catch (error) {
            this.orm.cacheAlgolia(hotspot.id, false);
            this.logger.error(MCDVLoggerEvent.ALGOLIA_SYNC_FAILED, error.message, {
                hotspot,
            });
        }
    }

    public async remove(hotspotId: HotspotId) {
        await this.orm.delete(hotspotId);
    }

    public async cacheAlgolia(id: HotspotId, v: boolean) {
        await this.orm.cacheAlgolia(id, v);
    }

    public async removeSlideshowImagesFromHotspot(hotspot: Hotspot, slideshow: string[]) {
        await this.slideshow.removeImage((<MediaHotspot>hotspot).slideShow.toJSON(), slideshow);
    }
}

export default HotspotRepositoryPostgreSQL;
