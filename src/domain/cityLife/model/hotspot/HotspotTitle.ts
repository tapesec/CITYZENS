import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3

class HotspotTitle {
    constructor(private _title: string) {}

    get title() {
        return this._title;
    }

    toString(): string {
        return this._title;
    }

    isEqual(other: HotspotTitle) {
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return other.title === this.title;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }
}
export default HotspotTitle;
