import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import CitySample from '../../src/domain/cityLife/model/sample/CitySample';

const slugIt = require('slug');

const citysEndpointTests = (state : any) => {

    describe('/citys endpoint', () => {

        describe('GET /citys/{slug}', () => {

            it ('should return a city by commune slug', async () => {
                // Arrange
                const slug = slugIt(CitySample.MARTIGNAS.name);
                // Act
                const response = await request(server)
                .get('/citys/' + slug)
                .set('Authorization', `Bearer ${state.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).
                    to.have.property('name').to.be.equal(CitySample.MARTIGNAS.name);
            });
        });
    });
};

export default citysEndpointTests;
