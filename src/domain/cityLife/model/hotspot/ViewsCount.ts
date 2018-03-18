import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3

class ViewsCount implements ValueObject {
    constructor(private _views: number) {}

    get views() {
        return this._views;
    }

    toString() {
        return this._views;
    }

    public isEqual(other: ViewsCount) {
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return other.views === this.views;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }
}
export default ViewsCount;
