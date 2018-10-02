import * as lodash from 'lodash';
import ValueObject from '../ValueObject';
import * as uuid from 'uuid/v4';

class CityzenId implements ValueObject {
    constructor(public id?: string) {
        if (!id) {
            this.id = uuid();
        }
    }

    public toString() {
        return this.id;
    }

    public toJSON() {
        return this.id;
    }

    public isEqual(other: CityzenId) {
        return lodash.isEqual(this, other);
    }
}

export default CityzenId;
