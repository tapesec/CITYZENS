import Hotspot, { HotspotScope } from '../hotspot/Hotspot';
import AddressSample from './AddressSample';
import PositionSample from './PositionSample';
import ContentSample from './ContentSample';
import AuthorSample from './AuthorSample';

class HotspotSample {

    public static TOWNHALL : Hotspot = new Hotspot(
        'townhall-static-id',
        'Mairie',
        PositionSample.TOWNHALL,
        ContentSample.MARTIGNAS_TOWNHALL_MESSAGE,
        AuthorSample.ELODIE,
        '33273',
        AddressSample.TOWNHALL_ADDRESS,
        HotspotScope.Public,
    );

    public static SCHOOL : Hotspot = new Hotspot(
        'school-static-id',
        'Ecole Flora Tristan',
        PositionSample.SCHOOL,
        ContentSample.MARTIGNAS_SCHOOL_MESSAGE,
        AuthorSample.LOUISE,
        '33273',
        AddressSample.SCHOOL_ADDRESS,
        HotspotScope.Public,
    );

    public static CHURCH : Hotspot = new Hotspot(
        'church-static-id',
        'Eglise de Martignas',
        PositionSample.CHURCH,
        ContentSample.CHURCH_MESSAGE,
        AuthorSample.MARTIN,
        '33273',
        AddressSample.CHURCH_ADDRESS,
        HotspotScope.Public,
    );

    public static MERIGNAC : Hotspot = new Hotspot(
        'merignac-static-id',
        'Merignac centre',
        PositionSample.MERIGNAC,
        ContentSample.MARTIGNAS_TOWNHALL_MESSAGE,
        AuthorSample.ELODIE,
        '33281',
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        HotspotScope.Public,
    );

    public static TOEDIT : Hotspot = new Hotspot(
        'toedit-static-id',
        'ToEdit',
        PositionSample.TOEDIT,
        ContentSample.MARTIGNAS_TOEDIT_MESSAGE,
        AuthorSample.ELODIE,
        '33273',
        AddressSample.TOEDIT_ADDRESS,
        HotspotScope.Public,
    );
}

export default HotspotSample;
