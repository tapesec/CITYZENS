import MediaBuilder from '../../factories/MediaBuilder';
import HotspotTitle from '../hotspot/HotspotTitle';
import { HotspotScope } from '../hotspot/Hotspot';

class MediaBuilderSample {
    public static TOWNHALL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Mairie de Martignas'),
        HotspotScope.Public,
    );

    public static SCHOOL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Ecole Flora Tristan'),
        HotspotScope.Public,
    );

    public static CHURCH_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Eglise de Martignas'),
        HotspotScope.Public,
    );

    public static MERIGNAC_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Merignac centre'),
        HotspotScope.Public,
    );

    public static TOEDIT_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('toEdit'),
        HotspotScope.Public,
    );
}

export default MediaBuilderSample;
