import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import PositionSample from './../../src/domain/cityLife/model/sample/PositionSample';
import { createHotspotBody, newHotspotResponse } from './sample/requests-responses';
import { username } from './sample/granted-cityzen';

const hotspotsEndpointsTests = (state : any) => {

    describe('/hotspots endpoint', () => {

        describe('GET /hotspot', () => {

            it ('should return a collection of hotspots in the given area', async () => {
                // Arrange
                const north = PositionSample.MARTIGNAS_NORTH_OUEST.latitude;
                const west = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
                const south = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
                const east = PositionSample.MARTIGNAS_SOUTH_EST.longitude;
                // Act

                const response = await request(server)
                .get('/hotspots')
                .set('Authorization', `Bearer ${state.access_token}`)
                .query({ north, west, south, east })
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.lengthOf(3);
            });

            it ('should return a collection of hotspots by city slug', async () => {
                // Arrange
                const slug = 'Martignas-sur-Jalle';
                // Act
                const response = await request(server)
                .get('/hotspots')
                .set('Authorization', `Bearer ${state.access_token}`)
                .query({ slug })
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.lengthOf(3);
            });
        });

        describe('POST /hotspots', async () => {
            it ('should return a new hotspot with 201 created status', async () => {
                // Act
                const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.access_token}`)
                .send(createHotspotBody)
                .set('Accept', 'application/json')
                .expect(201);

                // Assert
                const expectedRes = newHotspotResponse();

                expect(response.body).to.exist;
                expect(response.body.id).to.exist;
                expect(response.body.title).to.equal(expectedRes.title);
                expect(response.body.author)
                .to.have.property('pseudo').to.eql(username);
                expect(response.body.address)
                .to.have.property('name').to.eql(expectedRes.address.name);
                expect(response.body.address)
                .to.have.property('city').to.eql(expectedRes.address.city);
                expect(response.body.position)
                .to.have.property('latitude').to.eql(expectedRes.position.latitude);
                expect(response.body.position)
                .to.have.property('longitude').to.eql(expectedRes.position.longitude);
                expect(response.body.scope).to.eql(expectedRes.scope);
                expect(response.body.idCity).to.eql(expectedRes.idCity);
            });

            it ('should return 400 if bad request body format', async () => {
                // Act
                const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.access_token}`)
                .send({ foo: 'bar' })
                .set('Accept', 'application/json')
                .expect(400);
            });
        });
    });
};
export default hotspotsEndpointsTests;
