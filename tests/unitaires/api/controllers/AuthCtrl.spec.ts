import Login from '../../../../src/api/services/auth/Login';
import AuthCtrl from '../../../../src/api/controllers/AuthCtrl';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
const restifyErrors = require('restify-errors');

describe('AuthCtrl', () => {
    describe('login', () => {

        let reqMoq : TypeMoq.IMock<rest.Request>;
        let resMoq : TypeMoq.IMock<rest.Response>;
        let nextMoq : TypeMoq.IMock<rest.Next>;
        let loginServiceMoq : TypeMoq.IMock<Login>;
        let errorHandlerMoq : TypeMoq.IMock<ErrorHandler>;
        let queryStrings : any;
        let username : string;
        let password : string;

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
            loginServiceMoq = TypeMoq.Mock.ofType<Login>();
            errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => queryStrings);
        });

        it(
            `Should try to log user and return a 200 http response with authorization token`,
            async () => {
                // Arrange
                const body = {
                    token: 'a.jwt.token',
                };
                loginServiceMoq
                .setup(x => x.try(username, password))
                .returns(() => Promise.resolve(body));

                errorHandlerMoq
                .setup(x => x.logInternal('a', 'b', nextMoq.object))
                .returns(() => {});
                // Act
                const authCtrl = new AuthCtrl(errorHandlerMoq.object, loginServiceMoq.object);
                await authCtrl.login(reqMoq.object, resMoq.object, nextMoq.object);
                // Assert
                resMoq.verify(x => x.json(body), TypeMoq.Times.once());
            },
        );

        it(
            `Should try to log user and return a 401 http response with error description`,
            async () => {
                // Arrange
                const fakeError = { 
                    error: 'an error occured', 
                    error_description: 'error description',
                };
                loginServiceMoq
                .setup(x => x.try(username, password))
                .returns(() => Promise.resolve(fakeError));
                // Act
                const authCtrl = new AuthCtrl(loginServiceMoq.object);
                await authCtrl.login(reqMoq.object, resMoq.object, nextMoq.object);
                // Assert
                nextMoq
                .verify(
                    x => x(new restifyErrors.InvalidCredentialsError(fakeError.error_description)), 
                    TypeMoq.Times.once(),
                );
            },
        );
    });

});
