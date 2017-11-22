import Hotspot, { HotspotScope } from '../hotspot/Hotspot';
import AddressSample from './AddressSample';
import PositionSample from './PositionSample';
import ContentSample from './ContentSample';
import AuthorSample from './AuthorSample';

import { v4 } from 'uuid';

class HotspotSample {

    public static TOWNHALL : Hotspot = new Hotspot(
        v4(),
        'Mairie',
        PositionSample.TOWNHALL,
        ContentSample.MARTIGNAS_TOWNHALL_MESSAGE,
        AuthorSample.ELODIE,
        '33273',
        AddressSample.TOWNHALL_ADDRESS,
        HotspotScope.Public,
    );

    public static SCHOOL : Hotspot = new Hotspot(
        v4(),
        'Ecole Flora Tristan',
        PositionSample.SCHOOL,
        ContentSample.MARTIGNAS_SCHOOL_MESSAGE,
        AuthorSample.LOUISE,
        '33273',
        AddressSample.SCHOOL_ADDRESS,
        HotspotScope.Public,
    );

    public static CHURCH : Hotspot = new Hotspot(
        v4(),
        'Eglise de Martignas',
        PositionSample.CHURCH,
        ContentSample.CHURCH_MESSAGE,
        AuthorSample.MARTIN,
        '33273',
        AddressSample.CHURCH_ADDRESS,
        HotspotScope.Public,
    );

    public static MERIGNAC : Hotspot = new Hotspot(
        v4(),
        'Merignac centre',
        PositionSample.MERIGNAC,
        ContentSample.MARTIGNAS_TOWNHALL_MESSAGE,
        AuthorSample.ELODIE,
        '33281',
        AddressSample.RANDOM_MERIGNAC_ADDRESS,
        HotspotScope.Public,
    );
}

export default HotspotSample;