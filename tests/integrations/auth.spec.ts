import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';


describe('/auth endpoint', () => {

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
        });
    });
});


