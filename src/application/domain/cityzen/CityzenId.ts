import * as lodash from 'lodash';
import ValueObject from '../ValueObject';

class CityzenId implements ValueObject {
    constructor(private _id: string) {}

    public get id() {
        return this._id;
    }

    public toString() {
        return this._id;
    }

    public toJSON() {
        return this._id;
    }

    public toInt() {
        const last = this._id.lastIndexOf('|');
        const intPart = this._id.substr(last + 1);
        return parseInt(intPart, 10);
    }

    public isEqual(other: CityzenId) {
        return lodash.isEqual(this, other);
    }
}

export default CityzenId;
