import { expect } from 'chai';
import * as request from 'supertest';
import config from './../../src/api/config';
import * as server from './../../src/api/server';
import { votingPath } from './Voting.spec';
import alertHotspotsTests from './alertHotspot.spec';
import citiesEndpointTests from './cities.spec';
import hotspotsEndpointsTests from './hotspots.spec';
import mediaHotspotSpec from './mediaHotspot.spec';
import messagesEndpointsTests from './messages.spec';
import * as LoginSample from './sample/LoginSample';

describe('/auth endpoint', function() {
    this.timeout(10000);
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

            state.admin.access_token = responseAdmin.body.access_token;
            state.standard.access_token = responseStandard.body.access_token;
            state.standard.auth0id = config.test.standardAuth0id;
        });
    });

    mediaHotspotSpec(state);
    alertHotspotsTests(state);
    // /hotspots tests suite
    hotspotsEndpointsTests(state);
    // /cities tests suite
    citiesEndpointTests(state);
    // /hotspots/id/messages suite
    messagesEndpointsTests(state);

    // Start scenario of users interactions
    votingPath(state);
});
