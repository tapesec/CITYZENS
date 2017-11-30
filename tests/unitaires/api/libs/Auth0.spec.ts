import { ApiManagementCredentials, Auth0 } from '../../../../src/api/libs/Auth0';
import * as sinon from 'sinon';
import { expect } from 'chai';

describe('Auth0Sdk', () => {

    let credentials : ApiManagementCredentials;
    let userId : string;
    let request : any;
    let dataToUpdate : any;
    let auth0Sdk : Auth0;

    before(() => {
        credentials = {
            url: 'http://fake-url.com',
            token: 'fake.jwt.token',
            clientId: 'a-random-client-id',
            clientSecret: 'a-random-client-secret',
        };
        userId = 'auth0|fake-user-id';
        request = sinon.stub();
        auth0Sdk = new Auth0(credentials, request);
    });

    after(() => {
        credentials = null;
        userId = null;
        request = null;
        dataToUpdate = null;
        auth0Sdk = null;
    });

    describe('updateUserMetadataById', () => {

        it ('should perform an http request with corrects options', () => {
            // Arrange
            const dataToUpdate = { aUserAttribute: 'bar' };
            // Act
            auth0Sdk.updateUserMetadataById(userId, dataToUpdate);
            // Assert
            const HttpRequestIsCalledWithGivenOptions = request.calledWith({
                method: 'PATCH',
                url: `${credentials.url}/api/v2/users/${userId}`,
                headers: {
                    'content-type': 'application/json',
                    // tslint:disable-next-line:object-literal-key-quotes
                    'Authorization': `Bearer ${credentials.token}`,
                },
                body: { user_metadata: dataToUpdate },
                json: true,
            });
            expect(HttpRequestIsCalledWithGivenOptions).to.be.true;
        });
    });

    describe('getAuthenticationRefreshToken', () => {

        it ('should perform an http request with corrects options', () => {
            // Arrange
            const dataToUpdate = { aUserAttribute: 'bar' };
            const refreshToken = 'refresh.jwt.token';
            // Act
            auth0Sdk.getAuthenticationRefreshToken(refreshToken);
            // Assert
            const HttpRequestIsCalledWithGivenOptions = request.calledWith({
                method: 'POST',
                url: `${credentials.url}'/oauth/token`,
                headers: {
                    'content-type': 'application/json',
                    // tslint:disable-next-line:object-literal-key-quotes
                    'Authorization': `Bearer ${credentials.token}`,
                },
                body: {
                    grant_type : 'refresh_token',
                    client_id : credentials.clientId,
                    client_secret : credentials.clientSecret,
                    refresh_token : refreshToken,
                },
                json: true,
            });
        });

    });
});
