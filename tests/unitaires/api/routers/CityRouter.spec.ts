// tslint:disable-next-line:import-name
import * as restify from 'restify';
import * as TypeMoq from 'typemoq';
import CityCtrl from '../../../../src/api/controllers/CityCtrl';
import CityRouter from '../../../../src/api/routers/CityRouter';
import * as c from '../../../../src/api/routers/constants';
import Login from '../../../../src/api/services/auth/Login';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import cityRepositoryInMemory from '../../../../src/infrastructure/CityRepositoryInMemory';
import OrmCityzen from '../../../../src/infrastructure/ormCityzen';

describe('cities router', () => {
    it('should register routes related to cities', () => {
        // Arrange
        const serverMock: TypeMoq.IMock<restify.Server> = TypeMoq.Mock.ofType<restify.Server>();
        const errorHandlerMoq: TypeMoq.IMock<ErrorHandler> = TypeMoq.Mock.ofType<ErrorHandler>();
        const loginServiceMoq: TypeMoq.IMock<Login> = TypeMoq.Mock.ofType<Login>();

        const ormCityzenMoq: TypeMoq.IMock<OrmCityzen> = TypeMoq.Mock.ofType();

        const cityCtrl: TypeMoq.IMock<CityCtrl> = TypeMoq.Mock.ofType(
            CityCtrl,
            TypeMoq.MockBehavior.Loose,
            true,
            errorHandlerMoq,
            loginServiceMoq,
            ormCityzenMoq,
            cityRepositoryInMemory,
        );

        // new CityCtrl(errorHandler, loginService, cityRepositoryInMemory)
        const cityRouter = new CityRouter(cityCtrl.object);
        // Act
        cityRouter.bind(serverMock.object);
        // Assert
        serverMock.verify(
            x => x.get(`${c.CITY_ENDPOINT}/:slug`, cityCtrl.object.city),
            TypeMoq.Times.once(),
        );
    });
});
