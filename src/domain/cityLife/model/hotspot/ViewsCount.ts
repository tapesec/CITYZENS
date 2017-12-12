class ViewsCount {
    constructor(private _views: number) {}

    get views() {
        return this._views;
    }

    toString() {
        return this._views;
    }
}
export default ViewsCount;
