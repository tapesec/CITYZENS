import ValueObject from './../../../interface/ValueObject';

class ViewsCount implements ValueObject {
    constructor(private _views: number) {}

    get views() {
        return this._views;
    }

    toString() {
        return this._views;
    }

    public isEqual(other: ViewsCount) {
        return other.views === this.views;
    }
}
export default ViewsCount;
