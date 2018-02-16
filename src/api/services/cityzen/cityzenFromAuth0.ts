import Cityzen from '../../../domain/cityzens/model/Cityzen';
import UserInfoAuth0 from 'src/api/services/auth/UserInfoAuth0';

export class InvalidPayloadError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidPayloadError.prototype);
    }
}

const cityzenFromAuth0 = (payload : UserInfoAuth0): Cityzen => {
    let id: string;
    let email: string;
    let pseudo: string;
    let favoritesHotspots: Set<string>;
    let description: string;

    if (payload.sub) id = payload.sub;
    else throw new InvalidPayloadError('no subject found in userInfo\'s Auth0 payload');
    if (payload.email) email = payload.email;
    else throw new InvalidPayloadError('no email found in userInfo\'s Auth0 payload');
    if (payload.nickname) pseudo = payload.nickname;
    else throw new InvalidPayloadError('no nickname found in userInfo\'s Auth0 payload');

    if (payload.userMetadata && payload.userMetadata.favoritesHotspots) {
        const arrayFav = payload.userMetadata.favoritesHotspots as string[];
        favoritesHotspots = new Set<string>(arrayFav);
    }
    if (payload.userMetadata && payload.userMetadata.description) {
        description = payload.userMetadata.description;
    }

    const cityzen = new Cityzen(
        payload.sub, payload.email, payload.nickname, favoritesHotspots, description,
    );

    return cityzen;
};

export default cityzenFromAuth0;
