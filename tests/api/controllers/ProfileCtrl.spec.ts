import Cityzen from '../../../src/domain/cityzens/model/Cityzen';
import ProfileCtrl from '../../../src/api/controllers/ProfileCtrl';
import JwtParser from '../../../src/api/services/auth/JwtParser';
import config from '../../../src/api/config/';
import * as TypeMoq from 'typemoq';
import { expect } from 'chai';
import * as rest from 'restify';
// tslint:disable-next-line:max-line-length
import cityzenAuth0Repository, { CityzenAuth0Repository } from './../../../src/infrastructure/CityzenAuth0Repository';
import { Auth0 } from '../../../src/api/libs/Auth0';

describe('ProfileCtrl', () => {
    
    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let cityzenRepositoryMoq : TypeMoq.IMock<CityzenAuth0Repository>;
    let auth0Sdk : TypeMoq.IMock<Auth0>;
    let fakeDecodedToken : any;
    let jwtParser : TypeMoq.IMock<JwtParser>;
    let profileCtrl : ProfileCtrl;

    // simule la vérification et decode le token d'authentification
    before(async () => {
        // represente un jwt token décodé
        fakeDecodedToken = {
            sub: 'fake-id',
            email: 'fake@email.com',
            nickname: 'Alice',
            [`${config.auth.auth0JwtPayloadNamespace}/user_metadata`]: {
                favoritesHotspots: ['an-hotspot-id'],
            },
        };
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();

        // mock la lecture du header http contenant le jwt
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        const authorizationHeader = 'Bearer fake.jwt.token';
        reqMoq.setup(x => x.header('Authorization')).returns(() => authorizationHeader);

        // simule la validation du jwt token
        jwtParser = TypeMoq.Mock.ofType<JwtParser>();
        jwtParser
        .setup(x => x.verify(authorizationHeader.slice(7)))
        .returns(() => Promise.resolve(fakeDecodedToken));

        auth0Sdk = TypeMoq.Mock.ofType<Auth0>();
        cityzenRepositoryMoq = TypeMoq.Mock.ofType<CityzenAuth0Repository>();

        // instanciation du ProfilCtrl
        profileCtrl = new ProfileCtrl(
            jwtParser.object, cityzenRepositoryMoq.object, auth0Sdk.object);

        // appel du middleware de control d'acces de l'utilsateur
        await profileCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
    });

    describe('postFavorit', () => {

        let querystring : any;
        let params : any;
        let cityzenMoq : TypeMoq.IMock<Cityzen>;

        before(() => {
            querystring = {
                refresh_token: 'refresh.jwt.token',
            };
            params = {
                favoritHotspotId: 'fake-hotspot-id',
            };
            cityzenMoq = TypeMoq.Mock.ofType<Cityzen>();
        });
                                                                                            
        beforeEach(() => {
            
        });

        it ('should add a favorit hotspot and return a new jwt token', async () => {
            // Arrange
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => querystring);

            reqMoq
            .setup((x : rest.Request) => x.params)
            .returns(() => params);

            const cityzen = new Cityzen(
                fakeDecodedToken.sub, 
                fakeDecodedToken.email, 
                fakeDecodedToken.nickname,
            );
            cityzen.addHotspotAsFavorit(params.favoritHotspotId);

             // Act
            await profileCtrl.postFavorit(
                reqMoq.object,
                resMoq.object,
                nextMoq.object,
            );
            cityzenRepositoryMoq
            .verify(x => x.updateFavoritsHotspots(cityzen), TypeMoq.Times.once());
        });
    });
});
