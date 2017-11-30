import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import PositionSample from './../../src/domain/cityLife/model/sample/PositionSample';

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
                .set('Authorization', `Bearer ${state.id_token}`)
                .query({ north, west, south, east })
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.lengthOf(3);
            });

            it ('should return a collection of hotspots by city code commune', async () => {
                // Arrange
                const insee = '33273';
                // Act
                const response = await request(server)
                .get('/hotspots')
                .set('Authorization', `Bearer ${state.id_token}`)
                .query({ insee })
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.lengthOf(3);
            });
        });
    });
};
export default hotspotsEndpointsTests;
