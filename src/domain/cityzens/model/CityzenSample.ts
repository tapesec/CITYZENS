import ImageLocation from '../../cityLife/model/hotspot/ImageLocation';
import config from './../../../api/config';
import Cityzen from './Cityzen';
import CityzenId from './CityzenId';

class CityzenSample {
    public static MARTIN: Cityzen = new Cityzen(
        new CityzenId('auth0|4'),
        'martin@cityzen.com',
        'Martinus',
        false,
        new Set<string>(['auth0|fake-id1', 'auth0|fake-id2']),
        'Jeune enfant',
        new ImageLocation(undefined),
        new ImageLocation(config.cityzen.defaultAvatar),
        new Date(),
    );
    public static LOUISE: Cityzen = new Cityzen(
        new CityzenId('auth0|5'),
        'louise@cityzen.com',
        'Louisounette',
        false,
        new Set<string>(['auth0|fake-id2']),
        'Jeune écolière',
        new ImageLocation(undefined),
        new ImageLocation(config.cityzen.defaultAvatar),
        new Date(),
    );
    public static ELODIE: Cityzen = new Cityzen(
        new CityzenId('auth0|6'),
        'elodie@cityzen.com',
        'Princesse',
        false,
        new Set<string>(),
        'Infirmière libérale',
        new ImageLocation(undefined),
        new ImageLocation(config.cityzen.defaultAvatar),
        new Date(),
    );

    public static LIONNEL: Cityzen = new Cityzen(
        new CityzenId('auth0|7'),
        'lionel.dupouy@cityzen.com',
        'Lasalle',
        true,
        new Set<string>(),
        'Hipster',
        new ImageLocation(undefined),
        new ImageLocation(config.cityzen.defaultAvatar),
        new Date(),
    );

    public static LUCA: Cityzen = new Cityzen(
        new CityzenId('auth0|9'),
        'lucabrx@cityzen.com',
        'lucabrx',
        true,
        new Set<string>(),
        'Hipster',
        new ImageLocation(undefined),
        new ImageLocation(config.cityzen.defaultAvatar),
        new Date(),
    );
}

export default CityzenSample;
