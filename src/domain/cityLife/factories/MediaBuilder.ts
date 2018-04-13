import HotspotTitle from '../model/hotspot/HotspotTitle';
import { HotspotScope } from '../model/hotspot/Hotspot';
import HotspotSlug from 'src/domain/cityLife/model/hotspot/HotspotSlug';
import MemberList from '../model/hotspot/MemberList';
import ImageUrl from '../model/ImageUrl';
import Widget from '../model/hotspot/widget/Widget';
import WidgetList from '../model/hotspot/widget/WidgetList';

class MediaBuilder {
    constructor(
        protected _title: HotspotTitle,
        protected _slug: HotspotSlug,
        protected _scope: HotspotScope,
        protected _members: MemberList,
        protected _widgets: WidgetList,
        protected _avatarIconUrl?: ImageUrl,
    ) {}

    get avatarIconUrl() {
        return this._avatarIconUrl;
    }

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

    get widgets() {
        return this._widgets;
    }
}
export default MediaBuilder;
