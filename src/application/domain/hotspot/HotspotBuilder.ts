import Author from './Author';
import CityId from '../city/CityId';
import AvatarIconUrl from '../cityzen/AvatarIconUrl';
import { HotspotType } from './Hotspot';
import HotspotId from './HotspotId';
import ViewsCount from './ViewsCount';
import Address from './Address';
import Position from './Position';

class HotspotBuilder {
    constructor(
        protected _uid: HotspotId,
        protected _position: Position,
        protected _author: Author,
        protected _cityId: CityId,
        protected _address: Address,
        protected _views: ViewsCount,
        protected _type: HotspotType,
        protected _createdAt: Date,
        protected _avatarIconUrl: AvatarIconUrl,
    ) {}

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

    get cityId(): CityId {
        return this._cityId;
    }

    get address(): Address {
        return this._address;
    }

    get type(): HotspotType {
        return this._type;
    }

    get views(): ViewsCount {
        return this._views;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
export default HotspotBuilder;
