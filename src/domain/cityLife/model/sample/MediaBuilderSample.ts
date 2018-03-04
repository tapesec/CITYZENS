import MediaBuilder from '../../factories/MediaBuilder';
import HotspotTitle from '../hotspot/HotspotTitle';
import { HotspotScope } from '../hotspot/Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/HotspotSlug';
import CityzenSample from '../../../cityzens/model/CityzenSample';

const slug = require('slug');

class MediaBuilderSample {
    public static TOWNHALL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Mairie de Martignas'),
        new HotspotSlug(slug('Mairie de Martignas')),
        HotspotScope.Public,
        new Set<string>(),
    );

    public static SCHOOL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Ecole Flora Tristan'),
        new HotspotSlug(slug('Ecole Flora Tristan')),
        HotspotScope.Public,
        new Set<string>(),
    );

    public static CHURCH_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Eglise de Martignas'),
        new HotspotSlug(slug('Eglise de Martignas')),
        HotspotScope.Public,
        new Set<string>(),
    );

    public static MERIGNAC_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Merignac centre'),
        new HotspotSlug(slug('Merignac centre')),
        HotspotScope.Public,
        new Set<string>(),
    );

    public static TOEDIT_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('toEdit'),
        new HotspotSlug(slug('toEdit')),
        HotspotScope.Public,
        new Set<string>(),
    );

    public static MATCH_MEDIA_BUILDER = new MediaBuilder(
        new HotspotTitle('Matche football'),
        new HotspotSlug(slug('Matche football')),
        HotspotScope.Public,
        new Set<string>(),
    );

    public static DOCTOR_MEDIA_BUILDER = new MediaBuilder(
        new HotspotTitle('Docteur Maboul'),
        new HotspotSlug(slug('Docteur Maboul')),
        HotspotScope.Private,
        new Set<string>([CityzenSample.ELODIE.id, CityzenSample.LOUISE.id]),
    );
}

export default MediaBuilderSample;
