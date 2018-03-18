import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======

>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
class HotspotId implements ValueObject {
    constructor(private _id: string) {}

    get id() {
        return this._id;
    }

    toString() {
        return this.id;
    }

    isEqual(other: HotspotId) {
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return other.id === this.id;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }
}
export default HotspotId;
