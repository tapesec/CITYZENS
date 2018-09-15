import PositionSample from './PositionSample';
import PolygonSample from './PolygonSample';
import City from '../City';
import PostalCode from '../PostalCode';

class CitySample {
    public static MARTIGNAS = new City(
        'Martignas-sur-Jalle',
        '33273',
        new PostalCode('33127'),
        PositionSample.CHURCH,
        PolygonSample.MARTIGNAS_SUR_JALLE,
    );
    public static SIMCITY = new City(
        'Simcity',
        '33333',
        new PostalCode('33127'),
        PositionSample.TOEDIT,
        PolygonSample.SIMCITY,
    );
    public static MERIGNAC = new City(
        'Merignac',
        '33700',
        new PostalCode('33127'),
        PositionSample.MERIGNAC,
        PolygonSample.MERIGNAC,
    );
}

export default CitySample;
