import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import hotspotsEndpointsTests from './hotspots.spec';
import citiesEndpointTests from './cities.spec';
import messagesEndpointsTests from './messages.spec';
import { loginBody } from './sample/requests-responses';


describe('/auth endpoint', () => {

    const state : any = {};

    describe('GET /auth/token', () => {
        it ('should return jwt token after received credentials', async () => {
            // Act
            const response = await request(server)
            .get('/auth/token')
            .query(loginBody)
            .set('Accept', 'application/json')
            .expect(200);
            // Assert
            expect(response.body).to.have.property('access_token');
            expect(response.body).to.have.property('id_token');
            expect(response.body).to.have.property('refresh_token');
            // Finaly
            state.id_token = response.body.id_token;
            state.refresh_token = response.body.refresh_token;
            state.access_token = response.body.access_token;
        });
    });
    // /hotspots tests suite
    hotspotsEndpointsTests(state);
    // /cities tests suite
    citiesEndpointTests(state);
    // /hotspots/id/messages suite
    messagesEndpointsTests(state);
});
