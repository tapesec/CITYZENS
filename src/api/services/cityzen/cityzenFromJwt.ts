import Cityzen from '../../../domain/cityzens/model/Cityzen';
import DecodedJwtPayload from '../auth/DecodedJwtPayload';
import CityzenId from '../../../domain/cityzens/model/CityzenId';

const cityzenFromJwt = (payload: DecodedJwtPayload): Cityzen => {
    let id: CityzenId;
    let email: string;
    let pseudo: string;
    let favoritesHotspots: Set<string>;
    let description: string;
    let isAdmin = false;

    if (payload.sub) id = new CityzenId(payload.sub);
    else throw new InvalidPayloadError('no subject found in jwt decoded payload');
    if (payload.email) email = payload.email;
    else throw new InvalidPayloadError('no email found in jwt decoded payload');
    if (payload.nickname) pseudo = payload.nickname;
    else throw new InvalidPayloadError('no nickname found in jwt decoded payload');

    if (payload.isAdmin) isAdmin = payload.isAdmin;

    if (payload.userMetadata && payload.userMetadata.favoritesHotspots) {
        const arrayFav = payload.userMetadata.favoritesHotspots as string[];
        favoritesHotspots = new Set<string>(arrayFav);
    }
    if (payload.userMetadata && payload.userMetadata.description) {
        description = payload.userMetadata.description;
    }

    const cityzen = new Cityzen(id, email, pseudo, isAdmin, favoritesHotspots, description);

    return cityzen;
};

export class InvalidPayloadError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidPayloadError.prototype);
    }
}

export default cityzenFromJwt;
