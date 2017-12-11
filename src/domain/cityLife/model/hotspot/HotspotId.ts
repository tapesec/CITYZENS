class HotspotId {
    constructor(private _id : string) {}

    get id() {
        return this._id;
    }

    toString() {
        return this.id;
    }
}
export default HotspotId;
