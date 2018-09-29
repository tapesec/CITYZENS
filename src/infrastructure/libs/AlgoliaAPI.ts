import config from '../../api/config';
import { AlgoliaIndex, AlgoliaClient } from 'algoliasearch';
import retryPromise from './retryPromise';

class AlgoliaAPI {
    protected indexes: Map<string, AlgoliaIndex>;

    constructor(protected client: AlgoliaClient) {
        this.indexes = new Map<string, AlgoliaIndex>();
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
        const opts = {
            retries: 5,
        };

        return retryPromise(() => this.indexes.get(indexName).addObject(data, id), opts);
    }
}

export default AlgoliaAPI;
