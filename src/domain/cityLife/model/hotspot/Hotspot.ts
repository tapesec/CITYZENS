import HotspotBuilder from '../../factories/HotspotBuilder';
import Author from '../author/Author';
import CityId from '../city/CityId';
import Address from './Address';
import AvatarIconUrl from './AvatarIconUrl';
import HotspotId from './HotspotId';
import Position from './Position';
import ViewsCount from './ViewsCount';

export enum HotspotScope {
    Public = 'public',
    Private = 'private',
}

export enum HotspotType {
    Media = 'Media',
    Alert = 'Alert',
}

abstract class Hotspot {
    protected _uid: HotspotId;
    protected _position: Position;
    protected _author: Author;
    protected _cityId: CityId;
    protected _address: Address;
    protected _views: ViewsCount;
    protected _type: HotspotType;
    protected _createdAt: Date;
    protected _avatarIconUrl: AvatarIconUrl;

    constructor(builder: HotspotBuilder) {
        this._uid = builder.id;
        this._position = builder.position;
        this._author = builder.author;
        this._cityId = builder.cityId;
        this._address = builder.address;
        this._views = builder.views;
        this._type = builder.type;
        this._createdAt = builder.createdAt;
        this._avatarIconUrl = builder.avatarIconUrl;
    }

    get avatarIconUrl() {
        return this._avatarIconUrl;
    }

    get id(): HotspotId {
        return this._uid;
    }

    get position(): Position {
        return this._position;
    }

    get author(): Author {
        return this._author;
    }

    get cityId(): string {
        return this._cityId.toString();
    }

    get address(): Address {
        return this._address;
    }

    get views(): number {
        return this._views.toString();
    }

    get type(): HotspotType {
        return this._type;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    countOneMoreView(): void {
        this._views = new ViewsCount(this._views.toString() + 1);
    }

    moveTo(newLat: number, newLng: number): void {
        this._position = new Position(newLat, newLng);
    }

    changeAddress(newAddress: string): void {
        this._address = new Address(newAddress, this._address.city);
    }

    public changeAvatarIconurl(avatarIconUrl: AvatarIconUrl) {
        this._avatarIconUrl = avatarIconUrl;
    }

    toJSON() {
        return {
            avatarIconUrl: this.avatarIconUrl.toString(),
            id: this.id.toString(),
            position: this.position,
            author: this.author.toJSON(),
            cityId: this.cityId,
            address: this.address,
            views: this.views,
            type: this.type,
            createdAt: this.createdAt.toJSON(),
        };
    }
}

export default Hotspot;
