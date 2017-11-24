import Cityzen from '../../../domain/cityzens/model/Cityzen';
import DecodedJwtPayload from '../auth/DecodedJwtPayload';

const cityzenFromJwt = (payload : DecodedJwtPayload) : Cityzen => {

    const cityzen = new Cityzen(
        payload.sub,
        payload.email,
        payload.nickname, payload.userMetadata.favoritesHotspots, payload.userMetadata.description);

    return cityzen;
};

export default cityzenFromJwt;
