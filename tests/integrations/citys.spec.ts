import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';

const citysEndpointTests = (state : any) => {

    describe('/citys endpoint', () => {

        describe('GET /citys/{insee}', () => {

            it ('should return a city by code commune', async () => {
                // Arrange
                const insee = '33273';
                // Act
                const response = await request(server)
                .get('/citys/' + insee)
                .set('Authorization', `Bearer ${state.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.property('name').to.be.equal('Martignas sur jalles');
            });
        });
    });
};

export default citysEndpointTests;
