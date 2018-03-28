import AuthCtrl from '../../../../src/api/controllers/AuthCtrl';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import * as sinon from 'sinon';
import Auth0Service from '../../../../src/api/services/auth/Auth0Service';
const restifyErrors = require('restify-errors');

describe('AuthCtrl', () => {
    describe('login', () => {
        let reqMoq: TypeMoq.IMock<rest.Request>;
        let resMoq: TypeMoq.IMock<rest.Response>;
        let nextMoq: TypeMoq.IMock<rest.Next>;
        let auth0ServiceMoq: TypeMoq.IMock<Auth0Service>;
        let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
        let queryStrings: any;
        let username: string;
        let password: string;

        before(() => {
            username = 'test@domain.com';
            password = 'fakePassword';
            queryStrings = {
                username,
                password,
            };
        });

        beforeEach(() => {
            reqMoq = TypeMoq.Mock.ofType<rest.Request>();
            resMoq = TypeMoq.Mock.ofType<rest.Response>();
            nextMoq = TypeMoq.Mock.ofType<rest.Next>();
            auth0ServiceMoq = TypeMoq.Mock.ofType<Auth0Service>();
            errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
            reqMoq.setup((x: rest.Request) => x.query).returns(() => queryStrings);
            reqMoq.setup(x => x.path()).returns(() => 'path');
        });

        it(`Should try to log user and return a 200 http response with authorization token`, async () => {
            // Arrange
            const body = {
                token: 'a.jwt.token',
            };
            auth0ServiceMoq
                .setup(x => x.login(username, password))
                .returns(() => Promise.resolve(body));

            // Act
            const authCtrl = new AuthCtrl(errorHandlerMoq.object, auth0ServiceMoq.object);
            await authCtrl.login(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            resMoq.verify(x => x.json(body), TypeMoq.Times.once());
        });

        it(`Should try to log user and return a 401 http response with error description`, async () => {
            // Arrange
            const fakeError = {
                error: 'an error occured',
                error_description: 'error description',
            };
            auth0ServiceMoq
                .setup(x => x.login(username, password))
                .returns(() => Promise.resolve(fakeError));

            errorHandlerMoq
                .setup(x =>
                    x.logAndCreateInvalidCredentials('DELETE path', fakeError.error_description),
                )
                .returns(() => 'error');

            // Act
            const authCtrl = new AuthCtrl(errorHandlerMoq.object, auth0ServiceMoq.object);
            await authCtrl.login(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });
    });
});
