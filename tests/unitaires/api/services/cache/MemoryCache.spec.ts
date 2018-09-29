import MemoryCache from '../../../../../src/infrastructure/libs/MemoryCache';
import * as Chai from 'chai';

describe('MemoryCache', () => {
    const memoryCache = new MemoryCache<string>();
    it('Should cache values', () => {
        memoryCache.set('key1', 1);
        memoryCache.set('key2', 2);

        Chai.expect(memoryCache.isValid('key1')).to.be.true;
        Chai.expect(memoryCache.isValid('key2')).to.be.true;
    });

    it('Should invalidate caches', () => {
        memoryCache.invalidate('key1');

        Chai.expect(memoryCache.isValid('key1')).to.be.false;
        Chai.expect(memoryCache.isValid('key2')).to.be.true;
    });
});
