import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import PositionSample from './../../src/domain/cityLife/model/sample/PositionSample';
import { createHotspotBody, newHotspotResponse } from './sample/requests-responses';
import { username } from './sample/granted-cityzen';
import WallHotspotSample from '../../src/domain/cityLife/model/sample/WallHotspotSample';

const hotspotsEndpointsTests = (state: any) => {
    describe('/hotspots endpoint', () => {
        describe('GET /hotspot', () => {
            it('should return a collection of hotspots in the given area', async () => {
                // Arrange
                const north = PositionSample.MARTIGNAS_NORTH_OUEST.latitude;
                const west = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
                const south = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
                const east = PositionSample.MARTIGNAS_SOUTH_EST.longitude;
                // Act

                const response = await request(server)
                    .get('/hotspots')
                    .query({ north, west, south, east })
                    .set('Accept', 'application/json')
                    .expect(200);

                expect(response.body).to.have.lengthOf(5);
            });

            it('should return a collection of hotspots by city insee', async () => {
                // Arrange
                const insee = '33273';
                // Act
                const response = await request(server)
                    .get('/hotspots')
                    .query({ insee })
                    .set('Accept', 'application/json')
                    .expect(200);

                expect(response.body).to.have.lengthOf(5);
            });
        });

        describe('GET /hotspot/{hotspotId}', () => {
            it('Should return 200 and requested id.', async () => {
                const id = WallHotspotSample.CHURCH.id;

                const response = await request(server)
                    .get(`/hotspots/${id}`)
                    .expect(200);

                expect(response.body.id).to.be.equal(id);
            });

            it('Should return 404 not found.', async () => {
                const id = 'non existent id';

                const response = await request(server)
                    .get(`/hotspots/${id}`)
                    .expect(404);
            });

            it('Should return 401 non authorized.', async () => {
                const id = WallHotspotSample.DOCTOR.id;

                const response = await request(server)
                    .get(`/hotspots/${id}`)
                    .expect(401);
            });
        });

        describe('POST /hotspots', async () => {
            it('should return a new hotspot with 201 created status', async () => {
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
                    .to.have.property('pseudo')
                    .to.eql(username);
                expect(response.body.address)
                    .to.have.property('name')
                    .to.eql(expectedRes.address.name);
                expect(response.body.address)
                    .to.have.property('city')
                    .to.eql(expectedRes.address.city);
                expect(response.body.position)
                    .to.have.property('latitude')
                    .to.eql(expectedRes.position.latitude);
                expect(response.body.position)
                    .to.have.property('longitude')
                    .to.eql(expectedRes.position.longitude);
                expect(response.body.scope).to.eql(expectedRes.scope);
                expect(response.body.idCity).to.eql(expectedRes.idCity);
            });

            it('should return 400 if bad request body format', async () => {
                // Act
                const response = await request(server)
                    .post('/hotspots')
                    .set('Authorization', `Bearer ${state.access_token}`)
                    .send({ foo: 'bar' })
                    .set('Accept', 'application/json')
                    .expect(400);
            });
        });

        describe('POST /hotspots/{hotspotId}/view.', () => {
            it('Should return 200 and count one view.', async () => {
                const id = WallHotspotSample.CHURCH.id;

                const response = await request(server)
                    .post(`/hotspots/${id}/views`)
                    .expect(200);
            });
            it('Should return 404.', async () => {
                const id = 'fake';
                const response = await request(server)
                    .post(`/hotspots/${id}/views`)
                    .expect(404);
            });
        });

        describe('POST /hotspots/{hotspotId}/members.', () => {
            it('Should return 200 and add member.', async () => {
                const body = {
                    memberId: 'new id',
                };
                const hotspotId = WallHotspotSample.CHURCH.id;
                const originalMembers = WallHotspotSample.CHURCH.members;

                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/members`)
                    .set('Authorization', `Bearer ${state.access_token}`)
                    .send(body)
                    .expect(200);

                expect(response.body)
                    .to.have.property('members')
                    .to.be.length(originalMembers.size + 1);
            });

            it('Should return 404.', async () => {
                const body = {
                    memberId: 'new id',
                };
                const hotspotId = 'fake id';

                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/members`)
                    .set('Authorization', `Bearer ${state.access_token}`)
                    .send(body)
                    .expect(404);
            });
        });
    });
};
export default hotspotsEndpointsTests;
