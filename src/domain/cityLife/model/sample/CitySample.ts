import PositionSample from './PositionSample';
import PolygonSample from './PolygonSample';
import City from '../city/City';

class CitySample {
    public static MARTIGNAS = new City(
        'Martignas-sur-Jalle', '33273', PositionSample.CHURCH, PolygonSample.MARTIGNAS_SUR_JALLE,
    );
    public static SIMCITY = new City(
        'Simcity', '33333', PositionSample.TOEDIT, PolygonSample.SIMCITY,
    );
    public static MERIGNAC = new City(
        'Merignac', '33700', PositionSample.MERIGNAC, PolygonSample.MERIGNAC,
    );
}

export default CitySample;
