import ValueObject from './../../../interface/ValueObject';

class Position implements ValueObject {
    protected lat: number;
    protected lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    get latitude(): number {
        return this.lat;
    }
    get longitude(): number {
        return this.lng;
    }

    toJSON() {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }

    public isEqual(other: Position) {
        return other.latitude === this.latitude && other.longitude === this.longitude;
    }
}

export default Position;
