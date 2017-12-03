class HotspotId {
    constructor(private _id : string) {}

    get id() {
        return this._id;
    }

    toJSON() {
        return {
            id: this.id,
        };
    }
}
export default HotspotId;
