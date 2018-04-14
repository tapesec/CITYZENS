import MediaBuilder from '../../factories/MediaBuilder';
import MediaHotspot from './MediaHotspot';
import HotspotBuilder from '../../factories/HotspotBuilder';

class WallHotspot extends MediaHotspot {
    constructor(hotpotBuilder: HotspotBuilder, MediaBuilder: MediaBuilder) {
        super(hotpotBuilder, MediaBuilder);
    }

    toJSON() {
        return {
            ...super.toString(),
        };
    }
}

export default WallHotspot;
