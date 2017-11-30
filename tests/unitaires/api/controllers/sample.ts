import config from '../../../../src/api/config';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import JwtParser from '../../../../src/api/services/auth/JwtParser';

export const getFakeDecodedToken = () => {
    return {
        sub: 'fake-id',
        email: 'fake@email.com',
        nickname: 'Alice',
        [`${config.auth.auth0JwtPayloadNamespace}/user_metadata`]: {
            favoritesHotspots: ['an-hotspot-id'],
        },
    };
};

export const setupReqAuthorizationHeader =
(reqMoq : TypeMoq.IMock<rest.Request>, jwtParserMoq : TypeMoq.IMock<JwtParser>) => {

    // mock la lecture du header http contenant le jwt
    const authorizationHeader = 'Bearer fake.jwt.token';
    reqMoq.setup(x => x.header('Authorization')).returns(() => authorizationHeader);

    const jwtParser : TypeMoq.IMock<JwtParser> = TypeMoq.Mock.ofType<JwtParser>();
    jwtParserMoq
    .setup(x => x.verify(authorizationHeader.slice(7)))
    .returns(() => Promise.resolve(getFakeDecodedToken()));

    return reqMoq;
};
