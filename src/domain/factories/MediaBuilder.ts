import HotspotTitle from '../model/HotspotTitle';
import { HotspotScope } from '../model/Hotspot';
import HotspotSlug from '../model/HotspotSlug';
import MemberList from '../model/MemberList';
import AvatarIconUrl from '../model/AvatarIconUrl';
import SlideShow from '../model/SlideShow';

class MediaBuilder {
    constructor(
        protected _title: HotspotTitle,
        protected _slug: HotspotSlug,
        protected _scope: HotspotScope,
        protected _members: MemberList,
        protected _slideShow?: SlideShow,
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

    get slideShow(): SlideShow {
        return this._slideShow;
    }
}
export default MediaBuilder;
