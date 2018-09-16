import * as server from '../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import CitySample from '../../src/domain/sample/CitySample';

const slugIt = require('slug');

const citiesEndpointTests = (state: any) => {
    describe('/cities endpoint', () => {
        describe('GET /cities/{slug}', () => {
            it('should return a city by commune slug', async () => {
                // Arrange
                const slug = slugIt(CitySample.MARTIGNAS.name);
                // Act
                const response = await request(server)
                    .get('/cities/' + slug)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(200);

                expect(response.body)
                    .to.have.property('name')
                    .to.be.equal(CitySample.MARTIGNAS.name);
            });
        });
    });
};

export default citiesEndpointTests;
