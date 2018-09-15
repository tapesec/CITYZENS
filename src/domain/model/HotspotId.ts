import ValueObject from './../interface/ValueObject';
import * as lodash from 'lodash';
class HotspotId implements ValueObject {
    constructor(private _id: string) {}

    get id() {
        return this._id;
    }

    toString() {
        return this.id;
    }

    isEqual(other: HotspotId) {
        return lodash.isEqual(this, other);
    }
}
export default HotspotId;
