import MediaBuilder from '../../factories/MediaBuilder';
import HotspotBuilder from '../../factories/HotspotBuilder';
import HotspotTitle from './HotspotTitle';
import Hotspot, { HotspotScope } from './Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/HotspotSlug';
import Cityzen from './../../../../domain/cityzens/model/Cityzen';
import MemberList from './MemberList';
const slug = require('slug');

class MediaHotspot extends Hotspot {
    protected _scope: HotspotScope;
    protected _title: HotspotTitle;
    protected _slug: HotspotSlug;
    protected _members: MemberList;

    constructor(hotpotBuilder: HotspotBuilder, mediaBuilder: MediaBuilder) {
        super(hotpotBuilder);
        this._scope = mediaBuilder.scope;
        this._title = mediaBuilder.title;
        this._slug = mediaBuilder.slug;
        this._members = mediaBuilder.members;
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

    public addMember(member: string) {
        this._members.add(member);
    }
    public excludeMember(member: string) {
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

    toString() {
        return {
            ...super.toString(),
            scope: this._scope,
            title: this._title.toString(),
            slug: this._slug.toString(),
            members: this._members.toString(),
        };
    }
}

export default MediaHotspot;
