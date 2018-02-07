import HotspotTitle from '../model/hotspot/HotspotTitle';
import { HotspotScope } from '../model/hotspot/Hotspot';
import HotspotSlug from 'src/domain/cityLife/model/HotspotSlug';


class MediaBuilder {

    constructor(
        protected _title: HotspotTitle,
        protected _slug: HotspotSlug,
        protected _scope: HotspotScope,
        protected _members: Set<string>,
    ) {}

    get scope(): HotspotScope {
        return this._scope;
    }

    get title() : HotspotTitle {
        return this._title;
    }

    get slug() : HotspotSlug {
        return this._slug;
    }

    get members(): Set<string> {
        return this._members;
    }
}
export default MediaBuilder;
