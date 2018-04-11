import DecodedJwtPayload from '../../../../src/api/services/auth/DecodedJwtPayload';
import * as rest from 'restify';
import JwtParser from '../../../../src/api/services/auth/JwtParser';
import RootCtrl from '../../../../src/api/controllers/RootCtrl';
import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import Login from '../../../../src/api/services/auth/Login';
import { FAKE_USER_INFO_AUTH0 } from '../services/samples';
import Auth0Service from '../../../../src/api/services/auth/Auth0Service';
const restifyErrors = require('restify-errors');

describe('RootCtrl', () => {
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let resMoq: TypeMoq.IMock<rest.Response>;
    let auth0ServiceMoq: TypeMoq.IMock<Auth0Service>;
    let reqMoq: TypeMoq.IMock<rest.Request>;
    let nextMoq: TypeMoq.IMock<rest.Next>;

    let token: string;

    beforeEach(() => {
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
        auth0ServiceMoq = TypeMoq.Mock.ofType<Auth0Service>();
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();

        token = 'javascript.web.token';

        reqMoq.setup(x => x.path()).returns(() => 'path');
    });

    describe('loadAuthenticatedUser', () => {
        it('should load an authorized cityzen according to given token passed by http header', async () => {
            // Arrange
            reqMoq.setup(x => x.header('Authorization')).returns(() => `Bearer ${token}`);

            auth0ServiceMoq
                .setup(x => x.getUserInfo(token))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

            // Act
            const rootCtrl = new RootCtrl(errorHandlerMoq.object, auth0ServiceMoq.object);
            await rootCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.once());
            auth0ServiceMoq.verify(x => x.getUserInfo(token), TypeMoq.Times.once());
            nextMoq.verify(x => x(), TypeMoq.Times.once());
        });

        it('should return unauthorized error if no http Authorization header provider', async () => {
            // Arrange
            reqMoq.setup(x => x.header('Authorization')).returns(() => undefined);

            auth0ServiceMoq
                .setup(x => x.getUserInfo(token))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized('path', 'Token must be provided'))
                .returns(() => 'error');

            // Act
            const rootCtrl = new RootCtrl(errorHandlerMoq.object, auth0ServiceMoq.object);
            await rootCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.exactly(1));
            auth0ServiceMoq.verify(x => x.getUserInfo(token), TypeMoq.Times.exactly(0));
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });

        it('should return unauthorized error if access token is invalid', async () => {
            // Arrange
            const decodeError = { message: 'Invalid token' };
            reqMoq.setup(x => x.header('Authorization')).returns(() => `Bearer ${token}`);

            auth0ServiceMoq
                .setup(x => x.getUserInfo(token))
                .returns(() => Promise.reject({ message: 'tata' }));

            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized('path', 'tata'))
                .returns(() => 'error');

            // Act
            const rootCtrl = new RootCtrl(errorHandlerMoq.object, auth0ServiceMoq.object);
            await rootCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.once());
            auth0ServiceMoq.verify(x => x.getUserInfo(token), TypeMoq.Times.exactly(1));
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });
    });

    describe('optInAuthenticateUser', () => {
        it('should _not_ return unauthorized error instead should set userInfo to null', async () => {
            // Arrange
            const decodeError = { message: 'Invalid token' };
            reqMoq.setup(x => x.header('Authorization')).returns(() => `Bearer ${token}`);

            auth0ServiceMoq.setup(x => x.getUserInfo(token)).returns(() => Promise.reject('tata'));

            // Act
            const rootCtrl = new RootCtrl(errorHandlerMoq.object, auth0ServiceMoq.object);
            await rootCtrl.optInAuthenticateUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.once());
            auth0ServiceMoq.verify(x => x.getUserInfo(token), TypeMoq.Times.exactly(1));
            nextMoq.verify(x => x(), TypeMoq.Times.once());
        });
    });
});
