import Login from '../../../src/api/services/auth/Login';
import AuthCtrl from '../../../src/api/controllers/AuthCtrl';
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';

describe('AuthCtrl', () => {
    describe('login', () => {

        let reqMoq : TypeMoq.IMock<rest.Request>;
        let resMoq : TypeMoq.IMock<rest.Response>;
        let nextMoq : TypeMoq.IMock<rest.Next>;
        let loginServiceMoq : TypeMoq.IMock<Login>;
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
        });

        it(
            `Should try to log user and return a 200 http response with authorization token`,
            async () => {
                // Arrange
                reqMoq
                .setup((x : rest.Request) => x.query)
                .returns(() => queryStrings);

                /* const loginService = new Login(
                    {
                        url: config.auth.auth0url,
                        clientId: config.auth.auth0ClientId,
                        clientSecret: config.auth.auth0ClientSecret,
                    },
                    request,
                ); */
                // Act
                const authCtrl = new AuthCtrl(loginServiceMoq.object);
                await authCtrl.login(reqMoq.object, resMoq.object, nextMoq.object);
                // Assert
            },
        );
    });

});
