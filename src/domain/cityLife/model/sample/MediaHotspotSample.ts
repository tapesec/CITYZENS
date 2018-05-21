import HotspotBuilderSample from './../../../../domain/cityLife/model/sample/HotspotBuilderSample';
import MediaBuilderSample from './../../../../domain/cityLife/model/sample/MediaBuilderSample';
import MediaHotspot from '../hotspot/MediaHotspot';

class MediaHotspotsSample {
    public static MATCH_EVENT = new MediaHotspot(
        HotspotBuilderSample.MATCH_HOTSPOT_BUILDER,
        MediaBuilderSample.MATCH_MEDIA_BUILDER,
    );

    public static TO_READ_EVENT_HOTSPOT_FOR_TEST = new MediaHotspot(
        HotspotBuilderSample.MERIGNAC_HOTSPOT_BUILDER,
        MediaBuilderSample.DOCTOR_MEDIA_BUILDER,
    );
}

export default MediaHotspotsSample;
