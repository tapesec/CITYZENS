import MediaBuilder from '../../factories/MediaBuilder';
import MediaHotspot from './MediaHotspot';
import HotspotBuilder from '../../factories/HotspotBuilder';
import CityId from '../city/CityId';
import HotspotId from './HotspotId';
import HotspotTitle from './HotspotTitle';
import Author from '../author/Author';
import Hotspot, { HotspotScope, HotspotType, HotspotIconType } from './Hotspot';
import Position from './Position';
import Address from './Address';

class EventHotspot extends MediaHotspot {

    constructor(
        hotpotBuilder: HotspotBuilder,
        mediaBuilder: MediaBuilder,
        protected _date_end: Date,

    ) {
        super(hotpotBuilder, mediaBuilder);
    }

    public get dateEnd(): Date {
        return this._date_end;
    }

    toJSON() {
        return {
            ...super.toString(),
            dateEnd: this.dateEnd,
        };
    }
}

export default EventHotspot;
