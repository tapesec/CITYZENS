import * as TypeMoq from 'typemoq';
import { Auth0 } from '../../../../../src/api/libs/Auth0';
import { FAKE_USER_INFO_AUTH0, FAKE_USER_INFO_BODY } from './../../services/samples';
import UserInfoAuth0 from '../../../../../src/api/services/auth/UserInfoAuth0';
import Auth0Service from '../../../../../src/api/services/auth/Auth0Service';
import ErrorHandler from '../../../../../src/api/services/errors/ErrorHandler';

describe('Auth0Service', () => {
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let reqMoq: TypeMoq.IMock<any>;
    let auth0Moq: TypeMoq.IMock<Auth0>;

    it('Should cache getUserInfo requests.', async () => {
        reqMoq = TypeMoq.Mock.ofType<any>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
        auth0Moq = TypeMoq.Mock.ofType<Auth0>();

        auth0Moq
            .setup(x => x.getUserInfo('ac tk'))
            .returns(() => Promise.resolve<any>(FAKE_USER_INFO_BODY));

        const auth0Service = new Auth0Service(
            auth0Moq.object,
            reqMoq.object,
            errorHandlerMoq.object,
        );

        await auth0Service.getUserInfo('ac tk');
        await auth0Service.getUserInfo('ac tk');
        await auth0Service.getUserInfo('ac tk');

        auth0Moq.verify(x => x.getUserInfo('ac tk'), TypeMoq.Times.once());
    });
});
