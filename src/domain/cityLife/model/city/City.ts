import Position from '../hotspot/Position';

class City {

    protected _name : string;
    protected _INSEE : string;
    protected _position2D : Position;
    
    constructor(name : string, insee : string, position2D : Position) {
        this._name = name;
        this._INSEE = insee;
        this._position2D = position2D;
    }

    get name() : string {
        return this._name;
    }

    get insee() : string {
        return this._INSEE;
    }

    get position() : Position {
        return this._position2D;
    }

    toJSON() {
        return {
            name: this._name,
            insee: this._INSEE,
            position2D: this._position2D,
        };
    }
}

export default City;
