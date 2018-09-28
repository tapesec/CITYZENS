import Position from '../hotspot/Position';
import PostalCode from './PostalCode';

class City {
    protected _name: string;
    protected _INSEE: string;
    protected _postalCode: PostalCode;
    protected _polygon: Position[];
    protected _position2D: Position;

    constructor(
        name: string,
        insee: string,
        postalCode: PostalCode,
        position2D: Position,
        polygon: Position[],
        public slug: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
        this._name = name;
        this._INSEE = insee;
        this._postalCode = postalCode;
        this._polygon = polygon;
        this._position2D = position2D;
    }

    get name(): string {
        return this._name;
    }

    get insee(): string {
        return this._INSEE;
    }

    get postalCode(): PostalCode {
        return this._postalCode;
    }

    get polygon(): Position[] {
        return this._polygon;
    }

    get position(): Position {
        return this._position2D;
    }

    toJSON() {
        return {
            name: this._name,
            insee: this._INSEE,
            postalCode: this._postalCode.toString(),
            polygon: this._polygon,
            position2D: this._position2D,
            slug: this.slug,
            createdAt: this.createdAt.toJSON(),
            updatedAt: this.createdAt.toJSON(),
        };
    }
}

export default City;
