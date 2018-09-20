import HotspotTitle from './HotspotTitle';
import { HotspotScope } from './Hotspot';
import HotspotSlug from './HotspotSlug';
import MemberList from './MemberList';
import AvatarIconUrl from '../cityzen/AvatarIconUrl';
import SlideShow from '../SlideShow';

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
