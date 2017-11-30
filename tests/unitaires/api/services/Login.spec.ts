import * as sinon from 'Sinon';
import { expect } from 'chai';
import Login, { LoginOptions } from '../../../../src/api/services/auth/Login';
describe('Login service', () => {

    it('Should call auth0 oauth/token endpoint to retrieve a jwt correct token', async () => {
        // Arrange
        const loginOptions : LoginOptions = {
            url: 'fake.authO.url',
            clientId: 'fake-clientId',
            clientSecret: 'fake-client-secret',
        };
        const fakeEmail = 'fake@email.com';
        const fakePassword = 'fakePassword';
        const requestParam = {
            method: 'POST',
            url: loginOptions.url + '/oauth/token',
            headers: { 'content-type': 'application/json' },
            body:
            {
                username: fakeEmail,
                password: fakePassword,
                grant_type: 'password',
                scope: 'openid offline_access',
                client_id: loginOptions.clientId,
                client_secret: loginOptions.clientSecret,
                connection: 'Cityzens',
            },
            json: true,
        };
        const moqRequest = sinon.stub();
        moqRequest.callsArgWith(1, undefined, { /* response */ }, { token: 'a-fake-valid-token' });
        // Act
        const loginService = new Login(loginOptions, moqRequest);
        const token = await loginService.try(fakeEmail, fakePassword);
        // Assert
        expect(moqRequest.calledOnce).to.be.true;
        expect(moqRequest.calledWith(requestParam)).to.be.true;
    });
});
