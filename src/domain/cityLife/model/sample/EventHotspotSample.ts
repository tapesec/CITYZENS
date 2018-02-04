import EventHotspot from './../../../../domain/cityLife/model/hotspot/EventHotspot';
import HotspotBuilderSample from './../../../../domain/cityLife/model/sample/HotspotBuilderSample';
import MediaBuilderSample from './../../../../domain/cityLife/model/sample/MediaBuilderSample';
import EventDescriptionSample from
    './../../../../domain/cityLife/model/sample/EventDescriptionSample';

class EventHotspotsSample {
    public static MATCH_EVENT = new EventHotspot(
        HotspotBuilderSample.MATCH_HOTSPOT_BUILDER,
        MediaBuilderSample.MATCH_MEDIA_BUILDER,
        new Date('December 30, 2038 15:42:02'),
        EventDescriptionSample.MATCH_DESCRIPTION,
    );
}

export default EventHotspotsSample;
