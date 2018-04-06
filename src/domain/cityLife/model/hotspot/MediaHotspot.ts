import MediaBuilder from '../../factories/MediaBuilder';
import HotspotBuilder from '../../factories/HotspotBuilder';
import HotspotTitle from './HotspotTitle';
import Hotspot, { HotspotScope } from './Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/hotspot/HotspotSlug';
import Cityzen from './../../../../domain/cityzens/model/Cityzen';
import MemberList from './MemberList';
import CityzenId from '../../../cityzens/model/CityzenId';
import AvatarIconUrl from './AvatarIconUrl';
const slug = require('slug');

class MediaHotspot extends Hotspot {
    protected _scope: HotspotScope;
    protected _title: HotspotTitle;
    protected _slug: HotspotSlug;
    protected _members: MemberList;
    protected _avatarIconUrl?: AvatarIconUrl;

    constructor(hotpotBuilder: HotspotBuilder, mediaBuilder: MediaBuilder) {
        super(hotpotBuilder);
        this._scope = mediaBuilder.scope;
        this._title = mediaBuilder.title;
        this._slug = mediaBuilder.slug;
        this._members = mediaBuilder.members;
        this._avatarIconUrl = mediaBuilder.avatarIconUrl;
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

    public changeAvatarIconurl(avatarIconUrl: AvatarIconUrl) {
        this._avatarIconUrl = avatarIconUrl;
    }

    toString() {
        const stringed: any = {
            ...super.toString(),
            scope: this._scope,
            title: this._title.toString(),
            slug: this._slug.toString(),
            members: this._members.toString(),
        };
        if (this.avatarIconUrl) {
            stringed.avatarIconUrl = this._avatarIconUrl.toString();
        }
        return stringed;
    }
}

export default MediaHotspot;
