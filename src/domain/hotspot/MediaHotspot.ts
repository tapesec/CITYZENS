import MediaBuilder from './MediaBuilder';
import HotspotBuilder from './HotspotBuilder';
import HotspotTitle from '../hotspot/HotspotTitle';
import Hotspot, { HotspotScope } from '../hotspot/Hotspot';
import HotspotSlug from '../hotspot/HotspotSlug';
import MemberList from './MemberList';
import CityzenId from '../cityzen/CityzenId';
import SlideShow from '../SlideShow';
const slug = require('slug');

class MediaHotspot extends Hotspot {
    protected _scope: HotspotScope;
    protected _title: HotspotTitle;
    protected _slug: HotspotSlug;
    protected _members: MemberList;
    protected _slideShow?: SlideShow;

    constructor(hotpotBuilder: HotspotBuilder, mediaBuilder: MediaBuilder) {
        super(hotpotBuilder);
        this._scope = mediaBuilder.scope;
        this._title = mediaBuilder.title;
        this._slug = mediaBuilder.slug;
        this._members = mediaBuilder.members;
        this._slideShow = mediaBuilder.slideShow;
    }

    get avatarIconUrl() {
        return this._avatarIconUrl;
    }

    get title(): string {
        return this._title.toString();
    }

    get slug(): string {
        return this._slug.toString();
    }

    get members(): MemberList {
        return this._members;
    }

    public addMember(member: CityzenId) {
        this._members.add(member);
    }
    public excludeMember(member: CityzenId) {
        this._members.delete(member);
    }

    public changeTitle(title: string): void {
        this._title = new HotspotTitle(title);
        this._slug = new HotspotSlug(slug(title));
    }

    get scope(): HotspotScope {
        return this._scope;
    }

    public changeScope(status: HotspotScope): void {
        this._scope = status;
    }

    public get slideShow() {
        return this._slideShow;
    }
    public changeSlideShow(slideShow: SlideShow) {
        this._slideShow = slideShow;
    }

    toJSON() {
        const stringed: any = {
            ...super.toJSON(),
            scope: this._scope,
            title: this._title.toString(),
            slug: this._slug.toString(),
            members: this._members.toString(),
        };
        if (this.slideShow !== undefined) {
            stringed.slideShow = this._slideShow.toJSON();
        }
        return stringed;
    }
}

export default MediaHotspot;
