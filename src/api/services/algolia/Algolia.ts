import AlgoliaAPI from './../../../api/libs/AlgoliaAPI';
import Hotspot from './../../../domain/cityLife/model/hotspot/Hotspot';
import WallHotspot from './../../../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from './../../../domain/cityLife/model/hotspot/EventHotspot';
import HotspotRepositoryInMemory from './../../../infrastructure/HotspotRepositoryInMemory';
import AlertHotspot from './../../../domain/cityLife/model/hotspot/AlertHotspot';

class Algolia {

    constructor(protected algolia: AlgoliaAPI) {
    }

    public initHotspots(): void {
        this.algolia.initIndex('hotspots');
    }

    public addHotspot<T extends Hotspot>(
        hotspot: T,
        repository: HotspotRepositoryInMemory,
    ): Promise<any> {

        const data: any = {
            address: hotspot.address.name,
            cityId: hotspot.cityId,
        };
        if (hotspot instanceof AlertHotspot) {
            data.message = hotspot.message;
        } else if (
            hotspot instanceof EventHotspot ||
            hotspot instanceof WallHotspot
        ) {
            data.title = hotspot.title;
            data.slug = hotspot.slug;
        }

        return this.algolia.sendObject(
            'hotspots',
            data,
            hotspot.id,
        );
    }

}

export default Algolia;
