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
        new HotspotId('11649609-dc10-4adb-8aac-61060247148f'),
        PositionSample.TOWNHALL,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOWNHALL_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
        new Date(),
    );

    public static SCHOOL_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('c28e94ef-ad1d-4260-8452-89a2b7bf298e'),
        PositionSample.SCHOOL,
        AuthorSample.LOUISE,
        new CityId('33273'),
        AddressSample.SCHOOL_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
        new Date(),
    );

    public static CHURCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('294305c8-9dd7-4b5e-8086-18c0b2ebf716'),
        PositionSample.CHURCH,
        AuthorSample.MARTIN,
        new CityId('33273'),
        AddressSample.CHURCH_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
        new Date(),
    );

    public static MERIGNAC_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('19eab732-1a3f-4bfb-abb0-1d0dde8a3669'),
        PositionSample.MERIGNAC,
        AuthorSample.ELODIE,
        new CityId('33281'),
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
        new Date(),
    );

    public static TOEDIT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('3cd7c870-5173-40bc-a7a1-335c6b2f23c6'),
        PositionSample.TOEDIT,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOEDIT_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
        new Date(),
    );

    public static TOEDIT_CAMELOT_HOTSTPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('4cd2c107-5173-40bc-a7a1-335c6b2f83c7'),
        PositionSample.CAMELOT,
        AuthorSample.LOUISE,
        new CityId('Glastonbury'),
        AddressSample.CAMELOT_ADRESS,
        new ViewsCount(1),
        HotspotType.Alert,
        HotspotIconType.Destruction,
        new Date(),
    );

    public static ACCIDENT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('d0568142-23f4-427d-83f3-e84443cc3643'),
        PositionSample.ACCIDENT,
        AuthorSample.LUCA,
        new CityId('33273'),
        AddressSample.ACCIDENT_ADDRESS,
        new ViewsCount(1),
        HotspotType.Alert,
        HotspotIconType.Accident,
        new Date(),
    );

    public static MATCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('a5d317f1-d8c8-4e71-849e-cf6860fc5ff3'),
        PositionSample.MATCH,
        AuthorSample.LUCA,
        new CityId('33273'),
        AddressSample.MATCH_ADDRESS,
        new ViewsCount(1),
        HotspotType.Event,
        HotspotIconType.Event,
        new Date(),
    );

    public static DOCTOR_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('a8524155-caa5-408b-b92f-65b4679a1fed'),
        PositionSample.DOCTOR,
        AuthorSample.LIONNEL,
        new CityId('33273'),
        AddressSample.DOCTOR_ADDRESS,
        new ViewsCount(1),
        HotspotType.WallMessage,
        HotspotIconType.Wall,
        new Date(),
    );
}

export default HotspotBuilderSample;
