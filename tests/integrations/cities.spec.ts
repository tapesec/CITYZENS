import { expect } from 'chai';
import { NOT_FOUND, OK } from 'http-status-codes';
import * as request from 'supertest';

import * as server from '../../src/api/server';
import CitySample from '../../src/application/domain/sample/CitySample';

const slugIt = require('slug');

const citiesEndpointTests = (state: any) => {
    describe('/cities endpoint', () => {
        describe('GET /cities/{slug}', () => {
            it('should return a city by commune slug', async () => {
                // Arrange
                const slug = CitySample.MARTIGNAS.slug;
                // Act
                const response = await request(server)
                    .get('/cities/' + slug)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(OK);
                expect(response.body)
                    .to.have.property('insee')
                    .to.be.equal(CitySample.MARTIGNAS.insee);
                expect(response.body)
                    .to.have.property('name')
                    .to.be.equal(CitySample.MARTIGNAS.name);
                expect(response.body)
                    .to.have.property('polygon')
                    .to.be.eql(JSON.parse(JSON.stringify(CitySample.MARTIGNAS.polygon)));
                expect(response.body)
                    .to.have.property('slug')
                    .to.be.equal(CitySample.MARTIGNAS.slug);
                expect(response.body)
                    .to.have.property('postalCode')
                    .to.be.equal(CitySample.MARTIGNAS.postalCode.toString());
            });
            it('should not return a city if slug is unknow', async () => {
                const slug = 'unknow-slug';
                // Act
                const response = await request(server)
                    .get('/cities/' + slug)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(NOT_FOUND);
                expect(response.notFound, response.text);
            });
        });
    });
};

export default citiesEndpointTests;
