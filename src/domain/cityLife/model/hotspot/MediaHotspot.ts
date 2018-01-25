import MediaBuilder from '../../factories/MediaBuilder';
import HotspotBuilder from '../../factories/HotspotBuilder';
import HotspotTitle from './HotspotTitle';
import Hotspot, { HotspotScope } from './Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/HotspotSlug';
const slug = require('slug');

class MediaHotspot extends Hotspot {

    protected _scope: HotspotScope;
    protected _title: HotspotTitle;
    protected _slug: HotspotSlug;

    constructor(
        hotpotBuilder: HotspotBuilder,
        mediaBuilder: MediaBuilder,
    ) {
        super(hotpotBuilder);
        this._scope = mediaBuilder.scope;
        this._title = mediaBuilder.title;
        this._slug = mediaBuilder.slug;
    }

    get title() : string {
        return this._title.toString();
    }

    get slug() : string {
        return this._slug.toString();
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
        };
    }
}

export default MediaHotspot;
