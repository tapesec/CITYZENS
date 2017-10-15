class Position {
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
            latitude: this.lat,
            longitude: this.longitude,
        };
    }
}

export default Position;
