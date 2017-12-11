import MediaBuilder from '../../factories/MediaBuilder';
import HotspotBuilder from '../../factories/HotspotBuilder';
import CityId from '../city/CityId';
import HotspotId from './HotspotId';
import HotspotTitle from './HotspotTitle';
import Author from '../author/Author';
import Hotspot, { HotspotScope, HotspotType, HotspotIconType } from './Hotspot';
import Position from './Position';
import Address from './Address';

class MediaHotspot extends Hotspot {

    protected _scope: HotspotScope;
    protected _title: HotspotTitle;

    constructor(
        hotpotBuilder: HotspotBuilder,
        mediaBuilder: MediaBuilder,
    ) {
        super(hotpotBuilder);
        this._scope = mediaBuilder.scope;
        this._title = mediaBuilder.title;
    }

    get title() : string {
        return this._title.toString();
    }

    public changeTitle(title: string): void {
        this._title = new HotspotTitle(title);
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
        };
    }
}

export default MediaHotspot;
