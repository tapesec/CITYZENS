import ValueObject from './../../../interface/ValueObject';

class HotspotTitle {
    constructor(private _title: string) {}

    get title() {
        return this._title;
    }

    toString(): string {
        return this._title;
    }

    isEqual(other: HotspotTitle) {
        return other.title === this.title;
    }
}
export default HotspotTitle;
