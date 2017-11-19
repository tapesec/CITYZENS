import Cityzen from './Cityzen';

class CityzenSample {
    public static MARTIN : Cityzen = 
    new Cityzen('auth0|fake-id1','martin@cityzen.com', 'Martinus', 'Jeune enfant');
    public static LOUISE : Cityzen = 
    new Cityzen('auth0|fake-id2','louise@cityzen.com', 'Louisounette', 'Jeune écolière');
    public static ELODIE : Cityzen = 
    new Cityzen('auth0|fake-id3','elodie@cityzen.com', 'Princesse', 'Infirmière libérale');
}

export default CityzenSample;
