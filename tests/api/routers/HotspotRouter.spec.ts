// tslint:disable-next-line:import-name
import JwtParser from '../../../src/api/services/auth/JwtParser';
import hotspotRepositoryInMemory
from '../../../src/infrastructure/HotspotRepositoryInMemory';
import HotspotRouter from '../../../src/api/routers/HotspotRouter';
import * as TypeMoq from 'typemoq';
import * as restify from 'restify';
import * as sinon from 'sinon';
import { expect } from 'chai';
import HotspotCtrl from '../../../src/api/controllers/HotspotCtrl';
import * as c from '../../../src/api/routers/constants';

describe('hotspots router', () => {

    it('should register routes related to hotspots', () => {
        // Arrange
        const serverMock : TypeMoq.IMock<restify.Server> = TypeMoq.Mock.ofType<restify.Server>();
        const jwtParser : TypeMoq.IMock<JwtParser> = TypeMoq.Mock.ofType<JwtParser>();
        const hotspotCtrl : TypeMoq.IMock<HotspotCtrl> =
        TypeMoq.Mock.ofType(
            HotspotCtrl,
            TypeMoq.MockBehavior.Loose,
            true,
            jwtParser, 
            hotspotRepositoryInMemory,
        );
        const hotspotRouter = new HotspotRouter(hotspotCtrl.object);
        // Act
        hotspotRouter.bind(serverMock.object);
        // Assert
        serverMock.verify(
            x => x.get(
                c.HOTSPOT_ENDPOINT,
                hotspotCtrl.object.loadAuthenticatedUser,
                hotspotCtrl.object.hotspots),
            TypeMoq.Times.once(),
        );
        serverMock.verify(
            x => x.post(
                c.HOTSPOT_ENDPOINT,
                hotspotCtrl.object.loadAuthenticatedUser,
                hotspotCtrl.object.hotspots),
            TypeMoq.Times.once(),
        );
    });
});
