import ValueObject from './../../../interface/ValueObject';
import * as lodash from 'lodash';

class HotspotTitle {
    constructor(private _title: string) {}

    get title() {
        return this._title;
    }

    toString(): string {
        return this._title;
    }

    isEqual(other: HotspotTitle) {
        return lodash.isEqual(this, other);
    }
}
export default HotspotTitle;
