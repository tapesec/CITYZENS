import WallHotspotSample from '../../../../src/domain/cityLife/model/sample/WallHotspotSample';
import Hotspot from '../../../../src/domain/cityLife/model/hotspot/Hotspot';
import HotspotRepositoryInMemory from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import Cityzen from '../../../../src/domain/cityzens/model/Cityzen';
import ProfileCtrl from '../../../../src/api/controllers/ProfileCtrl';
import JwtParser from '../../../../src/api/services/auth/JwtParser';
import config from '../../../../src/api/config';
import * as TypeMoq from 'typemoq';
import { expect } from 'chai';
import * as rest from 'restify';
// tslint:disable-next-line:max-line-length
import cityzenAuth0Repository, { CityzenAuth0Repository } from './../../../../src/infrastructure/CityzenAuth0Repository';
import { Auth0 } from '../../../../src/api/libs/Auth0';
import { OK } from 'http-status-codes';
import * as sample from './sample';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import Login from '../../../../src/api/services/auth/Login';
import { FAKE_USER_INFO_AUTH0 } from '../services/samples';
import cityzenFromAuth0 from '../../../../src/api/services/cityzen/cityzenFromAuth0';

describe('ProfileCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let cityzenRepositoryMoq : TypeMoq.IMock<CityzenAuth0Repository>;
    let auth0SdkMoq : TypeMoq.IMock<Auth0>;
    let errorHandlerMoq : TypeMoq.IMock<ErrorHandler>;
    let profileCtrl : ProfileCtrl;
    let hotspotRepositoryMoq : TypeMoq.IMock<HotspotRepositoryInMemory>;
    let loginServiceMoq: TypeMoq.IMock<Login>;

    // simule la vérification et decode le token d'authentification
    before(async () => {
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        auth0SdkMoq = TypeMoq.Mock.ofType<Auth0>();
        cityzenRepositoryMoq = TypeMoq.Mock.ofType<CityzenAuth0Repository>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        loginServiceMoq = TypeMoq.Mock.ofType<Login>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();

        reqMoq
            .setup(x => x.header('Authorization'))
            .returns(() => 'Bearer toto');

        loginServiceMoq
            .setup(x => x.auth0UserInfo('toto'))
            .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

        // instanciation du ProfilCtrl
        profileCtrl = new ProfileCtrl(
            errorHandlerMoq.object, loginServiceMoq.object,
            cityzenRepositoryMoq.object, auth0SdkMoq.object, hotspotRepositoryMoq.object,
        );

        // appel du middleware de control d'acces de l'utilsateur
        await profileCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
    });

    describe('postFavorit', () => {

        let queryStrings : any;
        let params : any;
        let cityzenMoq : TypeMoq.IMock<Cityzen>;
        let hotspotMoq : TypeMoq.IMock<Hotspot>;

        before(() => {
            queryStrings = {
                refresh_token: 'refresh.jwt.token',
            };
            params = {
                favoritHotspotId: 'fake-hotspot-id',
            };
            cityzenMoq = TypeMoq.Mock.ofType<Cityzen>();
            hotspotMoq = TypeMoq.Mock.ofType<Hotspot>();
        });

        it ('should add a favorit hotspot and return a new jwt token', async () => {
            // Arrange
            const renewedCredentials : any = {
                refresh_token: 'fake.new.token',
                access_token: 'fake-access-token',
            };

            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => queryStrings);

            reqMoq
            .setup((x : rest.Request) => x.params)
            .returns(() => params);

            auth0SdkMoq
            .setup(x => x.getAuthenticationRefreshToken(queryStrings.refresh_token))
            .returns(() => Promise.resolve(renewedCredentials));

            // simule l'existance du hotspot à ajouter en favoris
            hotspotRepositoryMoq
            .setup(x => x.findById(params.favoritHotspotId))
            .returns(() => WallHotspotSample.CHURCH);

            const cityzen = cityzenFromAuth0(FAKE_USER_INFO_AUTH0);
            cityzen.addHotspotAsFavorit(params.favoritHotspotId);

            cityzenRepositoryMoq
                .setup(x => x.updateFavoritesHotspots(cityzen))
                .returns(() => Promise.resolve());

             // Act
            await profileCtrl.postFavorit(
                reqMoq.object,
                resMoq.object,
                nextMoq.object,
            );
            // Assert
            cityzenRepositoryMoq
            .verify(x => x.updateFavoritesHotspots(cityzen), TypeMoq.Times.once());

            auth0SdkMoq
            .verify(
                x => x.getAuthenticationRefreshToken(queryStrings.refresh_token),
                TypeMoq.Times.once());

            resMoq
            .verify(
                x => x.json(OK, renewedCredentials),
                TypeMoq.Times.once(),
            );
        });
    });
});
