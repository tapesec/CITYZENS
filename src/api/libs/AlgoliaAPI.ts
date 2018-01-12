import config from './../config';
import * as AlgoliaSearch from 'algoliasearch';

class AlgoliaAPI {
    protected indexes: Map<string, AlgoliaSearch.AlgoliaIndex>;

    constructor(protected client: AlgoliaSearch.AlgoliaClient) {
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
