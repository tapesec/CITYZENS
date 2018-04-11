import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import hotspotsEndpointsTests from './hotspots.spec';
import citiesEndpointTests from './cities.spec';
import messagesEndpointsTests from './messages.spec';
import { loginBody } from './sample/requests-responses';
import * as LoginSample from './sample/LoginSample';
import { votingPath } from './Voting.spec';

describe('/auth endpoint', () => {
    const state: any = { admin: {}, standard: {} };

    describe('GET /auth/token', () => {
        it('should return jwt token after received credentials', async () => {
            const loginBody = {
                username: LoginSample.adminSample.username,
                password: LoginSample.adminSample.password,
            };

            // Act
            const responseAdmin = await request(server)
                .get('/auth/token')
                .query(loginBody)
                .set('Accept', 'application/json')
                .expect(200);

            loginBody.username = LoginSample.standardSample.username;
            loginBody.password = LoginSample.standardSample.password;

            const responseStandard = await request(server)
                .get('/auth/token')
                .query(loginBody)
                .set('Accept', 'application/json')
                .expect(200);
            // Assert
            expect(responseAdmin.body).to.have.property('access_token');
            expect(responseAdmin.body).to.have.property('id_token');
            expect(responseAdmin.body).to.have.property('refresh_token');
            // Finaly

            state.admin.id_token = responseAdmin.body.id_token;
            state.admin.refresh_token = responseAdmin.body.refresh_token;
            state.admin.access_token = responseAdmin.body.access_token;

            state.standard.id_token = responseStandard.body.id_token;
            state.standard.refresh_token = responseStandard.body.refresh_token;
            state.standard.access_token = responseStandard.body.access_token;
        });
    });
    // /hotspots tests suite
    hotspotsEndpointsTests(state);
    // /cities tests suite
    citiesEndpointTests(state);
    // /hotspots/id/messages suite
    messagesEndpointsTests(state);

    // Start scenario of users interactions
    votingPath(state);
});
