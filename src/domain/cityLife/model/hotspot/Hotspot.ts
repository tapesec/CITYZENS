import Address from './Address';
import Position from './Position';
import Content from './Content';
import Author from './Author';

export enum HotspotScope {
    Public = 'public',
    Private = 'private',
}

class Hotspot {

    protected _uid : string;
    protected _position : Position;
    protected _title : string;
    protected _content : Content;
    protected _author : Author;
    protected _idCity : string;
    protected _address : Address;
    protected _scope : HotspotScope;

    constructor(
        id : string,
        title : string,
        position : Position,
        content : Content,
        author : Author,
        idCity : string,
        address : Address,
        scope : HotspotScope,
    ) {
        this._uid = id;
        this._idCity = idCity;
        this._title = title;
        this._position = position;
        this._content = content;
        this._author = author;
        this._address = address;
        this._scope = scope;
    }
    get id() : string {
        return this._uid;
    }

    get position() : Position {
        return this._position;
    }

    get title() : string {
        return this._title;
    }

    get content() : Content {
        return this._content;
    }

    get author() : Author {
        return this._author;
    }

    get idCity() : string {
        return this._idCity;
    }

    get address() : Address {
        return this._address;
    }

    get scope() : HotspotScope {
        return this._scope;
    }

    moveTo(newLat : number, newLng : number) : void {
        this._position = new Position(newLat, newLng);
    }

    changeAddress(newAddress : string) : void {
        this._address = new Address(newAddress, this._address.city);
    }

    editMessage(message : string) : void {
        this._content = new Content(message, this._content.createdAt, new Date());
    }

    changeTitle(title : string) : void {
        this._title = title;
    }

    changeScope(status : HotspotScope) : void {
        this._scope = status;
    }

    toJSON() {
        return {
            id: this.id,
            idCity: this.idCity,
            title: this.title,
            position: this.position,
            content: this.content,
            author: this.author,
            address: this.address,
            scope: this.scope,
        };
    }
}

export default Hotspot;
