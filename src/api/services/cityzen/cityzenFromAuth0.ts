import UserInfoAuth0 from 'src/api/services/auth/UserInfoAuth0';
import ImageLocation from '../../../domain/hotspot/ImageLocation';
import Cityzen from '../../../domain/cityzen/Cityzen';
import CityzenId from '../../../domain/cityzen/CityzenId';

export class InvalidPayloadError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidPayloadError.prototype);
    }
}

const cityzenFromAuth0 = (payload: UserInfoAuth0): Cityzen => {
    let id: CityzenId;
    let email: string;
    let pseudo: string;
    let favoritesHotspots: Set<string>;
    let description: string;
    let pictureCityzen: string;
    let pictureExtern: string;
    let isAdmin = false;

    if (payload.sub) id = new CityzenId(payload.sub);
    else throw new InvalidPayloadError("no subject found in userInfo's Auth0 payload");
    if (payload.email) email = payload.email;
    else throw new InvalidPayloadError("no email found in userInfo's Auth0 payload");
    if (payload.nickname) pseudo = payload.nickname;
    else throw new InvalidPayloadError("no nickname found in userInfo's Auth0 payload");

    if (payload.isAdmin) isAdmin = payload.isAdmin;

    if (payload.userMetadata && payload.userMetadata.favoritesHotspots) {
        const arrayFav = payload.userMetadata.favoritesHotspots as string[];
        favoritesHotspots = new Set<string>(Array.from(arrayFav));
    }
    if (payload.userMetadata && payload.userMetadata.description) {
        description = payload.userMetadata.description;
    }

    pictureCityzen = payload.pictureCityzen;
    pictureExtern = payload.pictureExtern;

    const cityzen = new Cityzen(
        id,
        email,
        pseudo,
        isAdmin,
        favoritesHotspots,
        description,
        new ImageLocation(pictureExtern),
        new ImageLocation(pictureCityzen),
        new Date(payload.createdAt),
    );

    return cityzen;
};

export default cityzenFromAuth0;
