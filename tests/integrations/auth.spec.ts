import { expect } from 'chai';
import * as request from 'supertest';
import config from './../../src/api/config';
import * as server from './../../src/api/server';
import alertHotspotsTests from './alertHotspot.spec';
import citiesEndpointTests from './cities.spec';
import cityzenTest from './cityzen.spec';
import hotspotsEndpointsTests from './hotspots.spec';
import mediaHotspotSpec from './mediaHotspot.spec';
import messagesEndpointsTests from './messages.spec';
import * as LoginSample from './sample/LoginSample';
import { votingPath } from './Voting.spec';

describe('/auth endpoint', function() {
    this.timeout(10000);
    const state: any = { admin: {}, standard: {} };

    describe('GET /auth/token', () => {
        it.only('should return jwt token after received credentials', async () => {
            const loginBody = {
                email: LoginSample.adminSample.username,
                password: LoginSample.adminSample.password,
            };

            // Act
            const responseAdmin = await request(server)
                .post('/auth/token')
                .send(loginBody)
                .set('Accept', 'application/json')
                .expect(200);
            expect(responseAdmin.body).to.have.property('accessToken');

            console.log(responseAdmin.body, '----->');

            loginBody.email = LoginSample.standardSample.username;
            loginBody.password = LoginSample.standardSample.password;

            const responseStandard = await request(server)
                .post('/auth/token')
                .send(loginBody)
                .set('Accept', 'application/json')
                .expect(200);
            expect(responseAdmin.body).to.have.property('accessToken');
            // Assert

            state.admin.access_token = responseAdmin.body.access_token;
            state.standard.access_token = responseStandard.body.access_token;
            state.standard.auth0id = config.test.standardAuth0id;
        });
    });

    cityzenTest(state);

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
