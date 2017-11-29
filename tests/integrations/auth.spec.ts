import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import hotspotEndpointsTests from './hotspot.spec';


describe('/auth endpoint', () => {

    const state : any = {};

    describe('GET /auth/token', () => {
        it ('should return jwt token after received credentials', async () => {
            // Act
            const response = await request(server)
            .get('/auth/token')
            .query({ username: 'lionel.dupouy@gmail.com', password: 'MW6DPzxspBdb' })
            .set('Accept', 'application/json')
            .expect(200);
            // Assert
            expect(response.body).to.have.property('access_token');
            expect(response.body).to.have.property('id_token');
            expect(response.body).to.have.property('refresh_token');
            // Finaly
            state.id_token = response.body.id_token;
            state.refresh_token = response.body.refresh_token;
        });
    });
    // /hotspots tests suite
    hotspotEndpointsTests(state);
});
