import HotspotTitle from '../hotspot/HotspotTitle';
import MediaBuilder from '../../factories/MediaBuilder';
import CityId from '../city/CityId';
import Hotspot, { HotspotIconType, HotspotScope, HotspotType } from '../hotspot/Hotspot';
import HotspotId from '../hotspot/HotspotId';
import HotspotBuilder from '../../factories/HotspotBuilder';
import WallHotspot from '../hotspot/WallHotspot';
import AddressSample from './AddressSample';
import PositionSample from './PositionSample';
import AuthorSample from './AuthorSample';
import hotspotBuilderSample from './HotspotBuilderSample';
import mediaBuilderSample from './MediaBuilderSample';

class WallHotspotSample {

    public static TOWNHALL: WallHotspot = new WallHotspot(
        hotspotBuilderSample.TOWNHALL_HOTSPOT_BUILDER, mediaBuilderSample.TOWNHALL_MEDIA_BUILDER);

    public static SCHOOL: WallHotspot = new WallHotspot(
        hotspotBuilderSample.SCHOOL_HOTSPOT_BUILDER, mediaBuilderSample.SCHOOL_MEDIA_BUILDER);

    public static CHURCH: WallHotspot = new WallHotspot(
        hotspotBuilderSample.CHURCH_HOTSPOT_BUILDER, mediaBuilderSample.CHURCH_MEDIA_BUILDER);

    public static MERIGNAC: WallHotspot = new WallHotspot(
        hotspotBuilderSample.MERIGNAC_HOTSPOT_BUILDER, mediaBuilderSample.MERIGNAC_MEDIA_BUILDER);

    public static TOEDIT: WallHotspot = new WallHotspot(
        hotspotBuilderSample.TOEDIT_HOTSPOT_BUILDER, mediaBuilderSample.TOEDIT_MEDIA_BUILDER);

}

export default WallHotspotSample;
