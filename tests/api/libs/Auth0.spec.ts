import { ApiManagementCredentials, Auth0 } from '../../../src/api/libs/Auth0';
import * as sinon from 'sinon';
import { expect } from 'chai';

describe('Auth0Sdk', () => {
    
    describe('updateUserMetadataById', () => {
        
        it ('should perform an http request with corrects options', () => {
            // Arrange
            const credentials : ApiManagementCredentials = {
                url: 'http://fake-url.com',
                token: 'fake.jwt.token',
                clientId: 'a-random-client-id',
                clientSecret: 'a-random-client-secret',
            };
            const request = sinon.stub();
            const userId = 'auth0|fake-user-id';
            const dataToUpdate = { aUserAttribute: 'bar' };
            const auth0Sdk = new Auth0(credentials, request);
            
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


    });
});
