import ValueObject from './../../../interface/ValueObject';

class HotspotId implements ValueObject {
    constructor(private _id: string) {}

    get id() {
        return this._id;
    }

    toString() {
        return this.id;
    }

    isEqual(other: HotspotId) {
        return other.id === this.id;
    }
}
export default HotspotId;
