import MediaBuilder from '../../factories/MediaBuilder';
import HotspotBuilder from '../../factories/HotspotBuilder';
import HotspotTitle from './HotspotTitle';
import Hotspot, { HotspotScope } from './Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/HotspotSlug';
import Cityzen from './../../../../domain/cityzens/model/Cityzen';
const slug = require('slug');

class MediaHotspot extends Hotspot {

    protected _scope: HotspotScope;
    protected _title: HotspotTitle;
    protected _slug: HotspotSlug;
    protected _members: Set<string>;

    constructor(
        hotpotBuilder: HotspotBuilder,
        mediaBuilder: MediaBuilder,
    ) {
        super(hotpotBuilder);
        this._scope = mediaBuilder.scope;
        this._title = mediaBuilder.title;
        this._slug = mediaBuilder.slug;
        this._members = mediaBuilder.members;
    }

    get title() : string {
        return this._title.toString();
    }

    get slug() : string {
        return this._slug.toString();
    }

    get members(): Set<string> {
        return this._members;
    }

    public addMember(member: Cityzen) {
        this._members.add(member.id);
    }
    public excludeMember(member: Cityzen) {
        if (this._members.has(member.id)) this._members.delete(member.id);
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
            members: Array.from(this._members),
        };
    }
}

export default MediaHotspot;
