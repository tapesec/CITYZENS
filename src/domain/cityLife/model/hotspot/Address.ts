class Address {

    protected _name : string;
    protected _city : string;

    constructor(name : string, city : string) {
        this._name = name;
        this._city = city;
    }

    get name() : string {
        return this._name;
    }

    get city() : string {
        return this._city;
    }

    toJSON() {
        return {
            name: this.name,
            city: this.city,
        };
    }
}

export default Address;
