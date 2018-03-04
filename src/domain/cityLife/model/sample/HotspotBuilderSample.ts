import ViewsCount from '../hotspot/ViewsCount';
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
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static SCHOOL_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('school-static-id'),
        PositionSample.SCHOOL,
        AuthorSample.LOUISE,
        new CityId('33273'),
        AddressSample.SCHOOL_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static CHURCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('church-static-id'),
        PositionSample.CHURCH,
        AuthorSample.MARTIN,
        new CityId('33273'),
        AddressSample.CHURCH_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static MERIGNAC_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('merignac-static-id'),
        PositionSample.MERIGNAC,
        AuthorSample.ELODIE,
        new CityId('33281'),
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static TOEDIT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('toedit-static-id'),
        PositionSample.TOEDIT,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOEDIT_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );

    public static ACCIDENT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('ACCIDENT-hotspot-id'),
        PositionSample.ACCIDENT,
        AuthorSample.LUCA,
        new CityId('33273'),
        AddressSample.ACCIDENT_ADDRESS,
        new ViewsCount(1),
        HotspotType.Alert,
        HotspotIconType.Accident,
    );

    public static MATCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('match-static-id'),
        PositionSample.MATCH,
        AuthorSample.LUCA,
        new CityId('33273'),
        AddressSample.MATCH_ADDRESS,
        new ViewsCount(1),
        HotspotType.Event,
        HotspotIconType.Event,
    );

    public static DOCTOR_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('doctor-static-id'),
        PositionSample.DOCTOR,
        AuthorSample.LIONNEL2,
        new CityId('33273'),
        AddressSample.DOCTOR_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
    );
}

export default HotspotBuilderSample;
