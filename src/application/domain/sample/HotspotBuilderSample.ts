import HotspotBuilder from '../hotspot/HotspotBuilder';
import CityId from '../city/CityId';
import AvatarIconUrl from '../cityzen/AvatarIconUrl';
import { HotspotType } from '../hotspot/Hotspot';
import HotspotId from '../hotspot/HotspotId';
import ViewsCount from '../hotspot/ViewsCount';
import { DEFAULT_MEDIA_ICON } from '../constants';
import AddressSample from '../sample/AddressSample';
import AuthorSample from '../sample/AuthorSample';
import PositionSample from './PositionSample';

class HotspotBuilderSample {
    public static TOWNHALL_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('11649609-dc10-4adb-8aac-61060247148f'),
        PositionSample.TOWNHALL,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOWNHALL_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static SCHOOL_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('c28e94ef-ad1d-4260-8452-89a2b7bf298e'),
        PositionSample.SCHOOL,
        AuthorSample.LOUISE,
        new CityId('33273'),
        AddressSample.SCHOOL_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static CHURCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('294305c8-9dd7-4b5e-8086-18c0b2ebf716'),
        PositionSample.CHURCH,
        AuthorSample.MARTIN,
        new CityId('33273'),
        AddressSample.CHURCH_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static MERIGNAC_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('19eab732-1a3f-4bfb-abb0-1d0dde8a3669'),
        PositionSample.MERIGNAC,
        AuthorSample.ELODIE,
        new CityId('33281'),
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static TO_READ_EVENT_HOTSPOT_FOR_TEST_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('19eab232-1b3f-4bfb-abb0-1d0dde7a3669'),
        PositionSample.MERIGNAC,
        AuthorSample.ELODIE,
        new CityId('33281'),
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static TOEDIT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('3cd7c870-5173-40bc-a7a1-335c6b2f23c6'),
        PositionSample.TOEDIT,
        AuthorSample.ELODIE,
        new CityId('33273'),
        AddressSample.TOEDIT_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static TOEDIT_CAMELOT_HOTSTPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('4cd2c107-5173-40bc-a7a1-335c6b2f83c7'),
        PositionSample.CAMELOT,
        AuthorSample.LOUISE,
        new CityId('Glastonbury'),
        AddressSample.CAMELOT_ADRESS,
        new ViewsCount(1),
        HotspotType.Alert,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static ACCIDENT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('d0568142-23f4-427d-83f3-e84443cc3643'),
        PositionSample.ACCIDENT,
        AuthorSample.LUCA,
        new CityId('33273'),
        AddressSample.ACCIDENT_ADDRESS,
        new ViewsCount(1),
        HotspotType.Alert,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static TO_READ_ALERT_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('f0789142-23c5-123d-493-e84443cc3643'),
        PositionSample.TO_READ_ALERT,
        AuthorSample.LUCA,
        new CityId('5498'),
        AddressSample.TO_READ_ADDRESS,
        new ViewsCount(1),
        HotspotType.Alert,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static MATCH_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('a5d317f1-d8c8-4e71-849e-cf6860fc5ff3'),
        PositionSample.MATCH,
        AuthorSample.LUCA,
        new CityId('33273'),
        AddressSample.MATCH_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );

    public static DOCTOR_HOTSPOT_BUILDER: HotspotBuilder = new HotspotBuilder(
        new HotspotId('a8524155-caa5-408b-b92f-65b4679a1fed'),
        PositionSample.DOCTOR,
        AuthorSample.LIONNEL,
        new CityId('33273'),
        AddressSample.DOCTOR_ADDRESS,
        new ViewsCount(1),
        HotspotType.Media,
        new Date(),
        new AvatarIconUrl(DEFAULT_MEDIA_ICON),
    );
}

export default HotspotBuilderSample;
