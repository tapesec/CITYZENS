import HotspotBuilder from '../../factories/HotspotBuilder';
import CityId from '../city/CityId';
import HotspotId from './HotspotId';
import Address from './Address';
import Position from './Position';
import Content from './Content';
import Author from '../author/Author';

export enum HotspotScope {
    Public = 'public',
    Private = 'private',
}

export enum HotspotType {
    WallMessage = 'WallMessage',
    Event = 'Event',
    Accident = 'Accident',
    Deterioration = 'Deterioration',
}

export enum HotspotIconType {
    Wall = 'WallIcon',
    Event = 'EventIcon',
    Accident = 'AccidentIcon',
    Deterioration = 'DeteriorationIcon',
}

abstract class Hotspot {

    protected _uid: HotspotId;
    protected _position: Position;
    protected _author: Author;
    protected _cityId: CityId;
    protected _address: Address;
    protected _type: HotspotType;
    protected _iconType: HotspotIconType;

    constructor(builder: HotspotBuilder) {
        this._uid = builder.id;
        this._position = builder.position;
        this._author = builder.author;
        this._cityId = builder.cityId;
        this._address = builder.address;
        this._type = builder.type;
        this._iconType = builder.iconType;
    }

    get id() : string {
        return this._uid.toString();
    }

    get position() : Position {
        return this._position;
    }

    get author() : Author {
        return this._author;
    }

    get cityId() : string {
        return this._cityId.toString();
    }

    get address() : Address {
        return this._address;
    }

    get type(): HotspotType {
        return this._type;
    }

    get iconType(): HotspotIconType {
        return this._iconType;
    }

    moveTo(newLat : number, newLng : number) : void {
        this._position = new Position(newLat, newLng);
    }

    changeAddress(newAddress : string) : void {
        this._address = new Address(newAddress, this._address.city);
    }

    toString() {
        return {
            id: this.id,
            position: this.position,
            author: this.author,
            cityId: this.cityId,
            address: this.address,
            type: this.type,
            iconType: this.iconType,
        };
    }
}

export default Hotspot;
