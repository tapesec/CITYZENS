import ProfileCtrl from '../../../src/api/controllers/ProfileCtrl';
import JwtParser from '../../../src/api/services/auth/JwtParser';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
// tslint:disable-next-line:max-line-length
import cityzenAuth0Repository, { CityzenAuth0Repository } from './../../../src/infrastructure/CityzenAuth0Repository';
import { Auth0 } from '../../../src/api/libs/Auth0';

describe('ProfileCtrl', () => {

    describe('postFavorit', () => {

        let reqMoq : TypeMoq.IMock<rest.Request>;
        let resMoq : TypeMoq.IMock<rest.Response>;
        let nextMoq : TypeMoq.IMock<rest.Next>;
        let cityzenAuth0RepositoryMoq : TypeMoq.IMock<CityzenAuth0Repository>;
        let auth0Sdk : TypeMoq.IMock<Auth0>;
        let jwtParser : TypeMoq.IMock<JwtParser>;
        let querystring : any;
        let params : any;
        let profileCtrl : ProfileCtrl;

        before(() => {
            querystring = {
                refresh_token: 'refresh.jwt.token',
            };
            params = {
                favoritHotspotId: 'fake-hotspot-id',
            };
            jwtParser = TypeMoq.Mock.ofType<JwtParser>();
            auth0Sdk = TypeMoq.Mock.ofType<Auth0>();
            cityzenAuth0RepositoryMoq = TypeMoq.Mock.ofType<CityzenAuth0Repository>();
            profileCtrl = new ProfileCtrl(
                jwtParser.object, cityzenAuth0RepositoryMoq.object, auth0Sdk.object);
        });

        beforeEach(() => {
            reqMoq = TypeMoq.Mock.ofType<rest.Request>();
            resMoq = TypeMoq.Mock.ofType<rest.Response>();
            nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        });

        it ('should add a favorit hotspot and return a new jwt token', async () => {
            // Arrange
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => querystring);

            reqMoq
            .setup((x : rest.Request) => x.params)
            .returns(() => params);

             // Act
            const profileCtrl = new ProfileCtrl(
                jwtParser.object, cityzenAuth0RepositoryMoq.object, auth0Sdk.object);

            await profileCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);

            await profileCtrl.postFavorit(
                reqMoq.object,
                resMoq.object,
                nextMoq.object,
            );
        });
    });
});
