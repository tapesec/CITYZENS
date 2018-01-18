import HotspotTitle from '../model/hotspot/HotspotTitle';
import { HotspotScope } from '../model/hotspot/Hotspot';


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
