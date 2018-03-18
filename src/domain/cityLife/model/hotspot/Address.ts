import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3

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
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return this.name === other.name && this.city === other.city;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }

    toJSON() {
        return {
            name: this.name,
            city: this.city,
        };
    }
}

export default Address;
