import * as now from './../time/now';

class CacheUnit {
    public createdTime: number;

    constructor(public timeout: number, public cache: any) {
        this.createdTime = now.seconds();
    }

    public get isValid() {
        return now.seconds() - this.createdTime < this.timeout;
    }
}

class MemoryCache<KeyT> {
    private cacheMap: Map<KeyT, CacheUnit>;
    private static DEFAULT_OPTIONS = {
        timeout: 10,
    };

    constructor() {
        this.cacheMap = new Map<KeyT, CacheUnit>();
    }

    public get(key: KeyT) {
        return this.cacheMap.get(key).cache;
    }
    public set(key: KeyT, value: any, opts?: any) {
        const options = MemoryCache.DEFAULT_OPTIONS;
        if (opts !== undefined){
            if (opts.timeout !== undefined)
               options.timeout = opts.timeout;
        }
        const timeout = options.timeout;

        const cached = new CacheUnit(timeout, value);
        this.cacheMap.set(key, cached);
    }

    public isValid(key: KeyT){
        return this.cacheMap.has(key) && this.cacheMap.get(key).isValid;
    }

    public invalidate(key: KeyT){
        this.cacheMap.delete(key);
    }

    public clear() {
        this.cacheMap.clear();
    }
}

export default MemoryCache;