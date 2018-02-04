import MediaBuilder from '../../factories/MediaBuilder';
import HotspotTitle from '../hotspot/HotspotTitle';
import Hotspot, { HotspotScope } from '../hotspot/Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/HotspotSlug';

const slug = require('slug');

class MediaBuilderSample {
    public static TOWNHALL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Mairie de Martignas'),
        new HotspotSlug(slug('Mairie de Martignas')),
        HotspotScope.Public,
    );

    public static SCHOOL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Ecole Flora Tristan'),
        new HotspotSlug(slug('Ecole Flora Tristan')),
        HotspotScope.Public,
    );

    public static CHURCH_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Eglise de Martignas'),
        new HotspotSlug(slug('Eglise de Martignas')),
        HotspotScope.Public,
    );

    public static MERIGNAC_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Merignac centre'),
        new HotspotSlug(slug('Merignac centre')),
        HotspotScope.Public,
    );

    public static TOEDIT_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('toEdit'),
        new HotspotSlug(slug('toEdit')),
        HotspotScope.Public,
    );

    public static MATCH_MEDIA_BUILDER = new MediaBuilder(
        new HotspotTitle('Matche football'),
        new HotspotSlug(slug('Matche football')),
        HotspotScope.Public,
    );
}

export default MediaBuilderSample;
