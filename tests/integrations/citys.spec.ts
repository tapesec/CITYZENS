import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';

const citysEndpointTests = (state : any) => {

    describe('/citys endpoint', () => {

        describe('GET /citys/{insee}', () => {

            it ('should return a city by commune slug', async () => {
                // Arrange
                const slug = 'Martignas-sur-Jalle';
                // Act
                const response = await request(server)
                .get('/citys/' + slug)
                .set('Authorization', `Bearer ${state.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.property('name').to.be.equal('Martignas-sur-Jalle');
            });
        });
    });
};

export default citysEndpointTests;
