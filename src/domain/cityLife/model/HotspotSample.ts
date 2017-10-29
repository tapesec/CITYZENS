import Hotspot from './Hotspot';
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
    );

    public static SCHOOL : Hotspot = new Hotspot(
        v4(),
        'Ecole Flora Tristan',
        PositionSample.SCHOOL,
        ContentSample.MARTIGNAS_SCHOOL_MESSAGE,
        AuthorSample.LOUISE,
    );

    public static CHURCH : Hotspot = new Hotspot(
        v4(),
        'Eglise de Martignas',
        PositionSample.CHURCH,
        ContentSample.CHURCH_MESSAGE,
        AuthorSample.MARTIN,
    );

    public static MERIGNAC : Hotspot = new Hotspot(
            v4(),
            'Merignac centre',
            PositionSample.MERIGNAC,
            ContentSample.MARTIGNAS_TOWNHALL_MESSAGE,
            AuthorSample.ELODIE,
    );
}

export default HotspotSample;
