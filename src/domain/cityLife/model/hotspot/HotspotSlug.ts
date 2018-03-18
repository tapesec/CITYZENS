import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3

class HotspotSlug implements ValueObject {
    constructor(private _slug: string) {}

    get slug(): string {
        return this._slug;
    }

    toString(): string {
        return this._slug;
    }

    isEqual(other: HotspotSlug) {
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return other.slug === this.slug;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }
}
export default HotspotSlug;
