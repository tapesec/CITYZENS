import Cityzen from '../../../domain/cityzens/model/Cityzen';
import DecodedJwtPayload from '../auth/DecodedJwtPayload';

const cityzenFromJwt = (payload : DecodedJwtPayload) : Cityzen => {
    
    return new Cityzen(
        payload.sub, 
        payload.email, 
        payload.nickname, payload.userMetadata.favoritesHostpots, payload.userMetadata.description);
};

export default cityzenFromJwt;
