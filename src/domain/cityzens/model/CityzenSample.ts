import Cityzen from './Cityzen';
import CityzenId from './CityzenId';

class CityzenSample {
    public static MARTIN: Cityzen = new Cityzen(
        new CityzenId('auth0|postgre|4'),
        'martin@cityzen.com',
        'Martinus',
        false,
        new Set<string>(['auth0|fake-id1', 'auth0|fake-id2']),
        'Jeune enfant',
    );
    public static LOUISE: Cityzen = new Cityzen(
        new CityzenId('auth0|postgre|5'),
        'louise@cityzen.com',
        'Louisounette',
        false,
        new Set<string>(['auth0|fake-id2']),
        'Jeune écolière',
    );
    public static ELODIE: Cityzen = new Cityzen(
        new CityzenId('auth0|postgre|6'),
        'elodie@cityzen.com',
        'Princesse',
        false,
        undefined,
        'Infirmière libérale',
    );

    public static LIONNEL: Cityzen = new Cityzen(
        new CityzenId('auth0|postgre|7'),
        'lionel.dupouy@gmail.com',
        'Lasalle',
        true,
        undefined,
        'Hipster',
    );

    public static LUCA: Cityzen = new Cityzen(
        new CityzenId('auth0|postgre|9'),
        'lucabrx@hotmail.fr',
        'lucabrx',
        true,
        undefined,
        'Hipster',
    );
}

export default CityzenSample;
