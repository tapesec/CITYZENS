import Cityzen from './Cityzen';

class CityzenSample {
    public static MARTIN: Cityzen = new Cityzen(
        'auth0|fake-id1',
        'martin@cityzen.com',
        'Martinus',
        false,
        new Set<string>(['auth0|fake-id1', 'auth0|fake-id2']),
        'Jeune enfant',
    );
    public static LOUISE: Cityzen = new Cityzen(
        'auth0|fake-id2',
        'louise@cityzen.com',
        'Louisounette',
        false,
        new Set<string>(['auth0|fake-id2']),
        'Jeune écolière',
    );
    public static ELODIE: Cityzen = new Cityzen(
        'auth0|fake-id3',
        'elodie@cityzen.com',
        'Princesse',
        false,
        undefined,
        'Infirmière libérale',
    );

    public static LIONNEL: Cityzen = new Cityzen(
        'auth0|59f989805c12313f24aae17b',
        'lionel.dupouy@gmail.com',
        'Lasalle',
        true,
        undefined,
        'Hipster',
    );

    public static LIONNEL2: Cityzen = new Cityzen(
        'auth0|59f836a23f551143a6964889',
        'lionel.dupouy@gmail.com',
        'lionel.dupouy',
        true,
        undefined,
        'Casu',
    );

    public static LUCA: Cityzen = new Cityzen(
        'auth0|5a1e6928f96aa12d71333e0e',
        'lucabrx@gmail.com',
        'Lasalle',
        true,
        undefined,
        'Hipster',
    );
}

export default CityzenSample;
