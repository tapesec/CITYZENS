import HotspotTitle from '../model/hotspot/HotspotTitle';
import { HotspotScope } from '../model/hotspot/Hotspot';
import HotspotSlug from 'src/domain/cityLife/model/HotspotSlug';
import MemberList from '../model/hotspot/MemberList';

class MediaBuilder {
    constructor(
        protected _title: HotspotTitle,
        protected _slug: HotspotSlug,
        protected _scope: HotspotScope,
        protected _members: MemberList,
    ) {}

    get scope(): HotspotScope {
        return this._scope;
    }

    get title(): HotspotTitle {
        return this._title;
    }

    get slug(): HotspotSlug {
        return this._slug;
    }

    get members(): MemberList {
        return this._members;
    }
}
export default MediaBuilder;
