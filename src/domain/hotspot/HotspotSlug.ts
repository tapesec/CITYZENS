import ValueObject from '../ValueObject';
import * as lodash from 'lodash';

class HotspotSlug implements ValueObject {
    constructor(private _slug: string) {}

    get slug(): string {
        return this._slug;
    }

    toString(): string {
        return this._slug;
    }

    isEqual(other: HotspotSlug) {
        return lodash.isEqual(this, other);
    }
}
export default HotspotSlug;
