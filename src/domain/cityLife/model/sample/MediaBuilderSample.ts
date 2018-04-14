import MediaBuilder from '../../factories/MediaBuilder';
import HotspotTitle from '../hotspot/HotspotTitle';
import { HotspotScope } from '../hotspot/Hotspot';
import HotspotSlug from './../../../../domain/cityLife/model/hotspot/HotspotSlug';
import CityzenSample from '../../../cityzens/model/CityzenSample';
import MemberList from '../../model/hotspot/MemberList';
import ImageLocation from '../ImageLocation';
import config from './../../../../api/config';
import WidgetList from '../hotspot/widget/WidgetList';

const slug = require('slug');

class MediaBuilderSample {
    public static TOWNHALL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Mairie de Martignas'),
        new HotspotSlug(slug('Mairie de Martignas')),
        HotspotScope.Public,
        new MemberList(),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultWallIcon),
    );

    public static SCHOOL_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Ecole Flora Tristan'),
        new HotspotSlug(slug('Ecole Flora Tristan')),
        HotspotScope.Public,
        new MemberList(),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultWallIcon),
    );

    public static CHURCH_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Eglise de Martignas'),
        new HotspotSlug(slug('Eglise de Martignas')),
        HotspotScope.Public,
        new MemberList(),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultWallIcon),
    );

    public static MERIGNAC_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('Merignac centre'),
        new HotspotSlug(slug('Merignac centre')),
        HotspotScope.Public,
        new MemberList(),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultWallIcon),
    );

    public static TOEDIT_MEDIA_BUILDER: MediaBuilder = new MediaBuilder(
        new HotspotTitle('toEdit'),
        new HotspotSlug(slug('toEdit')),
        HotspotScope.Public,
        new MemberList(),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultWallIcon),
    );

    public static MATCH_MEDIA_BUILDER = new MediaBuilder(
        new HotspotTitle('Matche football'),
        new HotspotSlug(slug('Matche football')),
        HotspotScope.Public,
        new MemberList(),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultEventIcon),
    );

    public static DOCTOR_MEDIA_BUILDER = new MediaBuilder(
        new HotspotTitle('Docteur Maboul'),
        new HotspotSlug(slug('Docteur Maboul')),
        HotspotScope.Private,
        new MemberList([CityzenSample.ELODIE.id, CityzenSample.LOUISE.id]),
        new WidgetList([]),
        new ImageLocation(config.avatarIcon.defaultWallIcon),
    );
}

export default MediaBuilderSample;
