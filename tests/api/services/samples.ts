import DecodedJwtPayload from '../../../src/api/services/auth/DecodedJwtPayload';
import config from '../../../src/api/config/';

const decodedToken = {
    sub: 'fake-id',
    email: 'fake@email.com',
    nickname: 'Alice',
    [`${config.auth.auth0JwtPayloadNamespace}/user_metadata`]: {
        favoritesHotspots: ['an-hotspot-id'],
    },
};

export const DECODED_PAYLOAD =
new DecodedJwtPayload(decodedToken, config.auth.auth0JwtPayloadNamespace);
