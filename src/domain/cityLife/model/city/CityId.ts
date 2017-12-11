class CityId {
    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }

    toString() {
        return this.id;
    }
}
export default CityId;
