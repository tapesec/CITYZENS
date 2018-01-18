import ViewsCount from '../model/hotspot/ViewsCount';
import Address from './../model/hotspot/Address';
import CityId from '../model/city/CityId';
import Author from '../model/author/Author';
import HotspotId from '../model/hotspot/HotspotId';
import { HotspotType, HotspotIconType } from '../model/hotspot/Hotspot';
import Position from './../model/hotspot/Position';


class HotspotBuilder {

    constructor(
        protected _uid: HotspotId,
        protected _position: Position,
        protected _author: Author,
        protected _cityId: CityId,
        protected _address: Address,
        protected _views: ViewsCount,
        protected _type: HotspotType,
        protected _iconType: HotspotIconType,
    ) {}

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

    get iconType(): HotspotIconType {
        return this._iconType;
    }

    get views(): ViewsCount {
        return this._views;
    }

}
export default HotspotBuilder;
