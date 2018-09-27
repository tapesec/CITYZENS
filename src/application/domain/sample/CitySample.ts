import PositionSample from './PositionSample';
import PolygonSample from './PolygonSample';
import City from '../city/City';
import PostalCode from '../city/PostalCode';

class CitySample {
    public static MARTIGNAS = new City(
        'Martignas-sur-Jalle',
        '33273',
        new PostalCode('33127'),
        PositionSample.CHURCH,
        PolygonSample.MARTIGNAS_SUR_JALLE,
        'Martignas-sur-Jalle-a12b',
        new Date(),
        new Date(),
    );
    public static SIMCITY = new City(
        'Simcity',
        '33333',
        new PostalCode('33127'),
        PositionSample.TOEDIT,
        PolygonSample.SIMCITY,
        'Simcity-a12b',
        new Date(),
        new Date(),
    );
    public static MERIGNAC = new City(
        'Merignac',
        '33700',
        new PostalCode('33127'),
        PositionSample.MERIGNAC,
        PolygonSample.MERIGNAC,
        'Merignac-a12b',
        new Date(),
        new Date(),
    );
}

export default CitySample;
