// tslint:disable-next-line:import-name
import Login from '../../../../src/api/services/auth/Login';
import hotspotRepositoryInMemory from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import HotspotRouter from '../../../../src/api/routers/HotspotRouter';
import * as TypeMoq from 'typemoq';
import * as restify from 'restify';
import * as sinon from 'sinon';
import { expect } from 'chai';
import HotspotCtrl from '../../../../src/api/controllers/HotspotCtrl';
import * as c from '../../../../src/api/routers/constants';
import Algolia from '../../../../src/api/services/algolia/Algolia';
import AlgoliaAPI from '../../../../src/api/libs/AlgoliaAPI';
import HotspotFactory from '../../../../src/infrastructure/HotspotFactory';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';

describe('hotspots router', () => {
    it('should register routes related to hotspots', () => {
        // Arrange
        const serverMock: TypeMoq.IMock<restify.Server> = TypeMoq.Mock.ofType<restify.Server>();
        const errorHandlerMoq: TypeMoq.IMock<ErrorHandler> = TypeMoq.Mock.ofType<ErrorHandler>();
        const loginServiceMoq: TypeMoq.IMock<Login> = TypeMoq.Mock.ofType<Login>();
        const hostpotFactoryMoq: TypeMoq.IMock<HotspotFactory> = TypeMoq.Mock.ofType<
            HotspotFactory
        >();
        const algoliaMock: TypeMoq.IMock<Algolia> = TypeMoq.Mock.ofType<Algolia>(
            Algolia,
            TypeMoq.MockBehavior.Loose,
            true,
            AlgoliaAPI,
        );

        const hotspotCtrl: TypeMoq.IMock<HotspotCtrl> = TypeMoq.Mock.ofType(
            HotspotCtrl,
            TypeMoq.MockBehavior.Loose,
            true,
            errorHandlerMoq,
            loginServiceMoq,
            hotspotRepositoryInMemory,
            hostpotFactoryMoq,
            algoliaMock.object,
        );
        const hotspotRouter = new HotspotRouter(hotspotCtrl.object);
        // Act
        hotspotRouter.bind(serverMock.object);
        // Assert
        serverMock.verify(
            x =>
                x.get(
                    c.HOTSPOT_ENDPOINT,
                    hotspotCtrl.object.optInAuthenticateUser,
                    hotspotCtrl.object.hotspots,
                ),
            TypeMoq.Times.once(),
        );
        serverMock.verify(
            x =>
                x.post(
                    c.HOTSPOT_ENDPOINT,
                    hotspotCtrl.object.loadAuthenticatedUser,
                    hotspotCtrl.object.postHotspots,
                ),
            TypeMoq.Times.once(),
        );
    });
});
