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

class WallHotspot extends MediaHotspot {

    constructor(
        hotpotBuilder: HotspotBuilder,
        MediaBuilder: MediaBuilder,
    ) {
        super(hotpotBuilder, MediaBuilder);
    }

    toJSON() {
        return {
            ...super.toString(),
        };
    }
}

export default WallHotspot;
