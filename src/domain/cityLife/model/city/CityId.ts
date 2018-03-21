import ValueObject from './../../../interface/ValueObject';

class CityId implements ValueObject {
    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }

    toString() {
        return this.id;
    }

    public isEqual(other: CityId) {
        return other.id === this.id;
    }
}
export default CityId;
