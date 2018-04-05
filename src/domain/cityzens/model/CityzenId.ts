import ValueObject from './../../interface/ValueObject';
import * as lodash from 'lodash';

class CityzenId implements ValueObject {
    constructor(private _id: string) {}

    public get id() {
        return this._id;
    }

    public toString() {
        return this._id;
    }

    public isEqual(other: CityzenId) {
        return lodash.isEqual(this, other);
    }
}

export default CityzenId;
