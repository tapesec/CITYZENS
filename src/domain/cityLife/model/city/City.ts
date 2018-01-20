import Position from '../hotspot/Position';

class City {

    protected _name : string;
    protected _INSEE : string;
    protected _polygon : Position[];
    protected _position2D : Position;

    constructor(name : string, insee : string, position2D : Position, polygon : Position[]) {
        this._name = name;
        this._INSEE = insee;
        this._polygon = polygon;
        this._position2D = position2D;
    }

    get name() : string {
        return this._name;
    }

    get insee() : string {
        return this._INSEE;
    }

    get polygon() : Position[] {
        return this._polygon;
    }

    get position() : Position {
        return this._position2D;
    }

    toJSON() {
        return {
            name: this._name,
            insee: this._INSEE,
            polygon: this._polygon,
            position2D: this._position2D,
        };
    }
}

export default City;
