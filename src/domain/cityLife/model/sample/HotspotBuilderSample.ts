import HotspotBuilder from '../../factories/HotspotBuilder';
import HotspotId from '../hotspot/HotspotId';
import PositionSample from './PositionSample';
import AuthorSample from './AuthorSample';
import CityId from '../city/CityId';
import AddressSample from './AddressSample';
import { HotspotIconType, HotspotType } from '../hotspot/Hotspot';


class HotspotBuilderSample {
    public static TOWNHALL_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('townhall-static-id'),
        PositionSample.TOWNHALL,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOWNHALL_ADDRESS,
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static SCHOOL_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('school-static-id'),
        PositionSample.SCHOOL,
        AuthorSample.LOUISE,
        new CityId('33273'),
        AddressSample.SCHOOL_ADDRESS,
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static CHURCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('church-static-id'),
        PositionSample.CHURCH,
        AuthorSample.MARTIN,
        new CityId('33273'),
        AddressSample.CHURCH_ADDRESS,
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static MERIGNAC_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('merignac-static-id'),
        PositionSample.MERIGNAC,
        AuthorSample.ELODIE,
        new CityId('33281'),
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static TOEDIT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('toedit-static-id'),
        PositionSample.TOEDIT,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOEDIT_ADDRESS,
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );
}

export default HotspotBuilderSample;