import * as lodash from 'lodash';
import ValueObject from '../ValueObject';
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
