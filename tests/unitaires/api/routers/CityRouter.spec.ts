// tslint:disable-next-line:import-name
import Login from '../../../../src/api/services/auth/Login';
import cityRepositoryInMemory from '../../../../src/infrastructure/CityRepositoryInMemory';
import CityRouter from '../../../../src/api/routers/CityRouter';
import * as TypeMoq from 'typemoq';
import * as restify from 'restify';
import * as sinon from 'sinon';
import { expect } from 'chai';
import CityCtrl from '../../../../src/api/controllers/CityCtrl';
import * as c from '../../../../src/api/routers/constants';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';

describe('cities router', () => {

    it('should register routes related to cities', () => {
        // Arrange
        const serverMock: TypeMoq.IMock<restify.Server> = TypeMoq.Mock.ofType<restify.Server>();
        const errorHandlerMoq: TypeMoq.IMock<ErrorHandler> =
            TypeMoq.Mock.ofType<ErrorHandler>();
        const loginServiceMoq: TypeMoq.IMock<Login> = TypeMoq.Mock.ofType<Login>();

        const cityCtrl: TypeMoq.IMock<CityCtrl> =
            TypeMoq.Mock.ofType(
                CityCtrl,
                TypeMoq.MockBehavior.Loose,
                true,
                errorHandlerMoq,
                loginServiceMoq,
                cityRepositoryInMemory,
            );

            // new CityCtrl(errorHandler, loginService, cityRepositoryInMemory)
        const cityRouter = new CityRouter(cityCtrl.object);
        // Act
        cityRouter.bind(serverMock.object);
        // Assert
        serverMock.verify(
            x => x.get(
                `${c.CITY_ENDPOINT}/:slug`,
                cityCtrl.object.city),
            TypeMoq.Times.once(),
        );
    });
});
