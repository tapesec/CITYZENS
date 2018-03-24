import ValueObject from './../../../interface/ValueObject';
import * as lodash from 'lodash';

class ViewsCount implements ValueObject {
    constructor(private _views: number) {}

    get views() {
        return this._views;
    }

    toString() {
        return this._views;
    }

    public isEqual(other: ViewsCount) {
        return lodash.isEqual(this, other);
    }
}
export default ViewsCount;
