import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3

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
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return other.latitude === this.latitude && other.longitude === this.longitude;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }
}

export default Position;
