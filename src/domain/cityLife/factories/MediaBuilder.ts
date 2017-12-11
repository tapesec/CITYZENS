import Address from './../model/hotspot/Address';
import CityId from '../model/city/CityId';
import Author from '../model/author/Author';
import HotspotId from '../model/hotspot/HotspotId';
import HotspotTitle from '../model/hotspot/HotspotTitle';
import { HotspotScope, HotspotType, HotspotIconType } from '../model/hotspot/Hotspot';
import Position from './../model/hotspot/Position';


class MediaBuilder {

    constructor(
        protected _title: HotspotTitle,
        protected _scope: HotspotScope,
    ) {}

    get scope(): HotspotScope {
        return this._scope;
    }

    get title() : HotspotTitle {
        return this._title;
    }
}
export default MediaBuilder;
