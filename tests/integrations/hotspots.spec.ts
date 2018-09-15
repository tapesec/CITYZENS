import { expect } from 'chai';
import * as request from 'supertest';
import AlertHotspotSample from '../../src/domain/model/sample/AlertHotspotSample';
import MediaHotspotSample from '../../src/domain/model/sample/MediaHotspotSample';
import * as server from './../../src/api/server';
import PositionSample from '../../src/domain/model/sample/PositionSample';
import { AlertHotspotPostBody, MediaHotspotPostBody } from './sample/requests-responses';

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
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;

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

                expect(response.body).to.have.lengthOf(6);
            });

            it('should return 400 bad request', async () => {
                //
                const north = 'PositionSample.MARTIGNAS_NORTH_OUEST.latitude';
                const west = PositionSample.MARTIGNAS_NORTH_OUEST.longitude;
                const south = PositionSample.MARTIGNAS_SOUTH_EST.latitude;
                const east = PositionSample.MARTIGNAS_SOUTH_EST.longitude;
                // Act
                const response = await request(server)
                    .get('/hotspots')
                    .query({ north, west, south, east })
                    .set('Accept', 'application/json')
                    .expect(400);
            });
        });

        describe('POST /hotspots/{hotspotId}/members.', () => {
            let hotspotToMember;
            it('Should create a new mediaHotspot to add members to.', async () => {
                const response = await request(server)
                    .post('/hotspots')
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .send(MediaHotspotPostBody)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;

                hotspotToMember = response.body.id;
            });

            it('Should return 200 and add member.', async () => {
                const body = {
                    memberId: 'new id',
                };

                const response = await request(server)
                    .post(`/hotspots/${hotspotToMember}/members`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .send(body);
                expect(response.ok, response.text).to.be.true;

                expect(response.body, response.text)
                    .to.have.property('members')
                    .to.be.length(1);
                response.body.members.forEach(member => {
                    expect(member).to.not.be.null;
                    expect(member).to.not.be.undefined;
                });
            });

            it('Should return 404.', async () => {
                const body = {
                    memberId: 'new id',
                };

                const response = await request(server)
                    .post(`/hotspots/notHotspot/members`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .send(body);

                expect(response.notFound, response.text).to.be.true;
            });

            it('Should return 401 non authorized.', async () => {
                const body = {
                    memberId: 'new id',
                };

                const response = await request(server)
                    .post(`/hotspots/${hotspotToMember}/members`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .send(body);

                expect(response.unauthorized, response.text).to.be.true;
            });

            it('Should delete previously created hotspot.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${hotspotToMember}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');
                const response2 = await request(server)
                    .get(`/hotspots/${hotspotToMember}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response2.notFound, response2.text).to.be.true;
            });
        });

        describe('POST /hotspots/{hotspotId}/pertinence.', () => {
            let hotspotToMember;
            it('Should create a new mediaHotspot to add members to.', async () => {
                const response = await request(server)
                    .post('/hotspots')
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .send(AlertHotspotPostBody)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;

                hotspotToMember = response.body.id;
            });

            it('Should return 200.', async () => {
                const body = { agree: true };

                const response = await request(server)
                    .post(`/hotspots/${hotspotToMember}/pertinence`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .send(body);

                expect(response.ok, response.text).to.be.true;

                expect(response.body)
                    .to.have.property('voterList')
                    .to.be.length(1);
                expect(response.body.voterList[0]).to.be.length(2);
                expect(response.body.voterList[0][0]).to.be.equal(state.standard.auth0id);
                expect(response.body.voterList[0][1]).to.be.true;
            });

            it('Should return 404.', async () => {
                const hotspotId = 'fake';
                const body = { agree: true };

                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/pertinence`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .send(body)
                    .expect(404);
            });

            it('Should return 400 on double vote.', async () => {
                const body = { agree: true };

                const response = await request(server)
                    .post(`/hotspots/${hotspotToMember}/pertinence`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .send(body)
                    .expect(400);
            });
            it('Should return 400 on invalid request.', async () => {
                const body = { agree: 'Oui.', non: true };

                const response = await request(server)
                    .post(`/hotspots/${hotspotToMember}/pertinence`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .send(body)
                    .expect(400);
            });

            it('Should delete previously created hotspot.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${hotspotToMember}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');
                const response2 = await request(server)
                    .get(`/hotspots/${hotspotToMember}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response2.notFound, response2.text).to.be.true;
            });
        });

        describe('GET /hotspot/{hotspotId} no matter type', () => {
            it('Should return 404 not found.', async () => {
                const id = 'non existent id';

                const response = await request(server)
                    .get(`/hotspots/${id}`)
                    .expect(404);
            });

            it('Should return 401 non authorized.', async () => {
                const id = MediaHotspotSample.DOCTOR.id;

                const response = await request(server)
                    .get(`/hotspots/${id}`)
                    .expect(401);
            });
        });

        describe('DELETE /hotspots/{hotspotId}.', () => {
            let newHotspotId;

            before(async () => {
                const response = await request(server)
                    .post('/hotspots')
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .send(MediaHotspotPostBody)
                    .set('Accept', 'application/json')
                    .expect(201);
                newHotspotId = response.body.id;
            });

            it('Should return 401.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${AlertHotspotSample.ACCIDENT.id}`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`);
                expect(response.unauthorized, response.text).to.be.true;
            });

            it('Should return 200 and delete hotspot.', async () => {
                const id = newHotspotId;

                const response = await request(server)
                    .delete(`/hotspots/${id}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .expect(200);
            });

            it('Should return 404.', async () => {
                const id = 'unknow-id';
                const response = await request(server)
                    .delete(`/hotspots/${id}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .expect(404);
            });
        });
    });
};
export default hotspotsEndpointsTests;
