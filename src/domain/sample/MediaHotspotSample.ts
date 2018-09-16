import HotspotBuilderSample from './HotspotBuilderSample';
import MediaBuilderSample from './MediaBuilderSample';
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

    public static TOWNHALL = new MediaHotspot(
        HotspotBuilderSample.TOWNHALL_HOTSPOT_BUILDER,
        MediaBuilderSample.TOWNHALL_MEDIA_BUILDER,
    );

    public static SCHOOL = new MediaHotspot(
        HotspotBuilderSample.SCHOOL_HOTSPOT_BUILDER,
        MediaBuilderSample.SCHOOL_MEDIA_BUILDER,
    );

    public static CHURCH = new MediaHotspot(
        HotspotBuilderSample.CHURCH_HOTSPOT_BUILDER,
        MediaBuilderSample.CHURCH_MEDIA_BUILDER,
    );

    public static MERIGNAC = new MediaHotspot(
        HotspotBuilderSample.MERIGNAC_HOTSPOT_BUILDER,
        MediaBuilderSample.MERIGNAC_MEDIA_BUILDER,
    );

    public static TOEDIT = new MediaHotspot(
        HotspotBuilderSample.TOEDIT_HOTSPOT_BUILDER,
        MediaBuilderSample.TOEDIT_MEDIA_BUILDER,
    );

    public static DOCTOR = new MediaHotspot(
        HotspotBuilderSample.DOCTOR_HOTSPOT_BUILDER,
        MediaBuilderSample.DOCTOR_MEDIA_BUILDER,
    );
}

export default MediaHotspotsSample;
