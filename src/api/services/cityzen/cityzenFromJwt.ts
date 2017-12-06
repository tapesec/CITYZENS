
import Cityzen from '../../../domain/cityzens/model/Cityzen';
import DecodedJwtPayload from '../auth/DecodedJwtPayload';

const cityzenFromJwt = (payload : DecodedJwtPayload): Cityzen => {

    let id: string;
    let email: string;
    let pseudo: string;
    let favoritesHotspots: string[];
    let description: string;

    if (payload.sub) id = payload.sub;
    else throw new InvalidPayloadError('no subject found in jwt decoded payload');
    if (payload.email) email = payload.email;
    else throw new InvalidPayloadError('no email found in jwt decoded payload');
    if (payload.nickname) pseudo = payload.nickname;
    else throw new InvalidPayloadError('no nickname found in jwt decoded payload');

    if (payload.userMetadata && payload.userMetadata.favoritesHotspots) {
        favoritesHotspots = payload.userMetadata.favoritesHotspots;
    }
    if (payload.userMetadata && payload.userMetadata.description) {
        description = payload.userMetadata.description;
    }

    const cityzen = new Cityzen(
        payload.sub, payload.email, payload.nickname, favoritesHotspots, description);

    return cityzen;
};

class InvalidPayloadError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default cityzenFromJwt;
