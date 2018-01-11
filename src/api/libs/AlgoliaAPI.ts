import config from './../config';
import * as AlgoliaSearch from 'algoliasearch';
import Hotspot from './../../domain/cityLife/model/hotspot/Hotspot';
import WallHotspot from './../../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from './../../domain/cityLife/model/hotspot/EventHotspot';
import AlertHotspot from './../../domain/cityLife/model/hotspot/AlertHotspot';


class AlgoliaAPI {
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

    public isInit(name: string): boolean {
        return this.indexes.has(name);
    }

    public initIndex(name: string): void {
        const fullName = `${config.algolia.algoliaEnv}_${name}`;
        this.indexes.set(
            name, 
            this.client.initIndex(fullName),
        );
    }

    public sendObject(indexName: string, data: any, id?: string): Promise<any> {
        return this.indexes.get(indexName).addObject(data, id);
    }
}

export default AlgoliaAPI;
