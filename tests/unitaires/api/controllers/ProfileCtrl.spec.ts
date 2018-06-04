import { OK } from 'http-status-codes';
import * as rest from 'restify';
import * as TypeMoq from 'typemoq';
import ProfileCtrl from '../../../../src/api/controllers/ProfileCtrl';
// tslint:disable-next-line:max-line-length
import { Auth0 } from '../../../../src/api/libs/Auth0';
import Auth0Service from '../../../../src/api/services/auth/Auth0Service';
import cityzenFromAuth0 from '../../../../src/api/services/cityzen/cityzenFromAuth0';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import Hotspot from '../../../../src/domain/cityLife/model/hotspot/Hotspot';
import MediaHotspotSample from '../../../../src/domain/cityLife/model/sample/MediaHotspotSample';
import Cityzen from '../../../../src/domain/cityzens/model/Cityzen';
import CityzenId from '../../../../src/domain/cityzens/model/CityzenId';
import CityzenRepositoryPostgreSQL from '../../../../src/infrastructure/CityzenRepositoryPostgreSQL';
import HotspotRepositoryInMemory from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import { FAKE_USER_INFO_AUTH0 } from '../services/samples';

describe('ProfileCtrl', () => {
    let reqMoq: TypeMoq.IMock<rest.Request>;
    let resMoq: TypeMoq.IMock<rest.Response>;
    let nextMoq: TypeMoq.IMock<rest.Next>;
    let cityzenRepositoryMoq: TypeMoq.IMock<CityzenRepositoryPostgreSQL>;
    let auth0SdkMoq: TypeMoq.IMock<Auth0>;
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let profileCtrl: ProfileCtrl;
    let hotspotRepositoryMoq: TypeMoq.IMock<HotspotRepositoryInMemory>;
    let auth0ServiceMoq: TypeMoq.IMock<Auth0Service>;

    // simule la vérification et decode le token d'authentification
    before(async () => {
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        auth0SdkMoq = TypeMoq.Mock.ofType<Auth0>();
        cityzenRepositoryMoq = TypeMoq.Mock.ofType<CityzenRepositoryPostgreSQL>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        auth0ServiceMoq = TypeMoq.Mock.ofType<Auth0Service>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();

        reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer toto');

        auth0ServiceMoq
            .setup(x => x.getUserInfo('toto'))
            .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

        // instanciation du ProfilCtrl
        profileCtrl = new ProfileCtrl(
            errorHandlerMoq.object,
            auth0ServiceMoq.object,
            cityzenRepositoryMoq.object,
            auth0SdkMoq.object,
            hotspotRepositoryMoq.object,
        );

        // appel du middleware de control d'acces de l'utilsateur
        await profileCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
    });

    describe('postFavorit', () => {
        let queryStrings: any;
        let params: any;
        let cityzenMoq: TypeMoq.IMock<Cityzen>;
        let hotspotMoq: TypeMoq.IMock<Hotspot>;

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

        it('should add a favorit hotspot and return a new jwt token', async () => {
            // Arrange
            const renewedCredentials: any = {
                refresh_token: 'fake.new.token',
                access_token: 'fake-access-token',
            };

            reqMoq.setup((x: rest.Request) => x.query).returns(() => queryStrings);

            reqMoq.setup((x: rest.Request) => x.params).returns(() => params);

            auth0SdkMoq
                .setup(x => x.getAuthenticationRefreshToken(queryStrings.refresh_token))
                .returns(() => Promise.resolve(renewedCredentials));

            // simule l'existance du hotspot à ajouter en favoris
            hotspotRepositoryMoq
                .setup(x => x.findById(params.favoritHotspotId))
                .returns(() => Promise.resolve(MediaHotspotSample.CHURCH));

            const cityzen = cityzenFromAuth0(FAKE_USER_INFO_AUTH0);
            cityzen.addHotspotAsFavorit(params.favoritHotspotId);

            cityzenRepositoryMoq
                .setup(x =>
                    x.updateFavoritesHotspots(
                        Array.from(cityzen.favoritesHotspots),
                        new CityzenId(''),
                    ),
                )
                .returns(() => Promise.resolve());

            // Act
            await profileCtrl.postFavorit(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            cityzenRepositoryMoq.verify(
                x =>
                    x.updateFavoritesHotspots(
                        Array.from(cityzen.favoritesHotspots),
                        TypeMoq.It.isAny(),
                    ),
                TypeMoq.Times.once(),
            );

            auth0SdkMoq.verify(
                x => x.getAuthenticationRefreshToken(queryStrings.refresh_token),
                TypeMoq.Times.once(),
            );

            resMoq.verify(x => x.json(OK, renewedCredentials), TypeMoq.Times.once());
        });
    });
});
