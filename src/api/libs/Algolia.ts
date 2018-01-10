import config from './../config';
import * as AlgoliaSearch from 'algoliasearch';
import Hotspot from './../../domain/cityLife/model/hotspot/Hotspot';
import WallHotspot from './../../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from './../../domain/cityLife/model/hotspot/EventHotspot';
import AlertHotspot from './../../domain/cityLife/model/hotspot/AlertHotspot';


class Algolia {
    protected client: AlgoliaSearch.AlgoliaClient;
    
    protected indexes: Map<string, AlgoliaSearch.AlgoliaIndex>;

    constructor() {
        this.client = AlgoliaSearch(
            config.algolia.algoliaAppId,
            config.algolia.algoliaApiKey,
            config.algolia.opts,
        );
        this.indexes = new Map<string, AlgoliaSearch.AlgoliaIndex>();
    }

    public initIndex(name: string): void {
        const fullName = `${config.algolia.algoliaEnv}_${name}`;
        this.indexes.set(
            name, 
            this.client.initIndex(fullName),
        );
    }

    public addHotspot<T extends Hotspot>(hotspot: T): Promise<any> {
        const data: any = {
            address: hotspot.address,
            cityId: hotspot.cityId,
        };
        if (hotspot instanceof WallHotspot) {
            data.title = hotspot.title;
        } else if (hotspot instanceof EventHotspot) {
            data.title = hotspot.title;
        } else if (hotspot instanceof AlertHotspot) {
            data.message = hotspot.message;
        }
        return this.indexes.get('hotspots').addObject(
            data, 
            hotspot.id,
        );
    }

}

export default Algolia;
