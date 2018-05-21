import HotspotTitle from '../model/hotspot/HotspotTitle';
import { HotspotScope } from '../model/hotspot/Hotspot';
import HotspotSlug from 'src/domain/cityLife/model/hotspot/HotspotSlug';
import MemberList from '../model/hotspot/MemberList';
import AvatarIconUrl from '../model/hotspot/AvatarIconUrl';
import SlideShow from '../model/hotspot/SlideShow';

class MediaBuilder {
    constructor(
        protected _title: HotspotTitle,
        protected _slug: HotspotSlug,
        protected _scope: HotspotScope,
        protected _members: MemberList,
        protected _avatarIconUrl?: AvatarIconUrl,
        protected _slideShow?: SlideShow,
        protected _dateEnd?: Date,
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

    get slideShow(): SlideShow {
        return this._slideShow;
    }

    get dateEnd(): Date {
        return this._dateEnd;
    }
}
export default MediaBuilder;
