import ValueObject from './../../../interface/ValueObject';
import * as lodash from 'lodash';

class Address implements ValueObject {
    protected _name: string;
    protected _city: string;

    constructor(name: string, city: string) {
        this._name = name;
        this._city = city;
    }

    get name(): string {
        return this._name;
    }

    get city(): string {
        return this._city;
    }

    public isEqual(other: Address) {
        return lodash.isEqual(this, other);
    }

    toJSON() {
        return {
            name: this.name,
            city: this.city,
        };
    }
}

export default Address;
