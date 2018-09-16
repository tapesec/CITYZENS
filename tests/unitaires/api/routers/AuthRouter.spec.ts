// tslint:disable-next-line:import-name
import AuthRouter from '../../../../src/api/routers/AuthRouter';
import Login from '../../../../src/api/services/auth/Login';
import AuthCtrl from '../../../../src/api/controllers/AuthCtrl';
import * as TypeMoq from 'typemoq';
import * as restify from 'restify';
import * as c from '../../../../src/api/routers/constants';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';

describe('Auth router', () => {
    it('should register routes related to authentification', () => {
        // Arrange
        const serverMock: TypeMoq.IMock<restify.Server> = TypeMoq.Mock.ofType<restify.Server>();
        const errorHandlerMoq: TypeMoq.IMock<ErrorHandler> = TypeMoq.Mock.ofType<ErrorHandler>();
        const loginServiceMoq: TypeMoq.IMock<Login> = TypeMoq.Mock.ofType<Login>();
        const authCtrl: TypeMoq.IMock<AuthCtrl> = TypeMoq.Mock.ofType(
            AuthCtrl,
            TypeMoq.MockBehavior.Loose,
            true,
            errorHandlerMoq.object,
            loginServiceMoq.object,
        );
        const authRouter = new AuthRouter(authCtrl.object);
        // Act
        authRouter.bind(serverMock.object);
        // Assert
        serverMock.verify(x => x.get(c.AUTH_LOGIN, authCtrl.object.login), TypeMoq.Times.once());
    });
});
