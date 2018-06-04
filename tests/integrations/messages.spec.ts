import { expect } from 'chai';
import * as request from 'supertest';
import MediaHotspotSample from '../../src/domain/cityLife/model/sample/MediaHotspotSample';
import MessageSample from '../../src/domain/cityLife/model/sample/MessageSample';
import * as server from './../../src/api/server';
import { username } from './sample/granted-cityzen';
import {
    createMessageBody,
    editedMessageResponse,
    newMessageResponse,
    patchMessageBody,
} from './sample/requests-responses';

const messagesEndpointsTests = (state: any) => {
    describe('/messages endpoint', () => {
        let hotspotId: string;

        beforeEach(() => {
            hotspotId = MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.hotspotId.id;
        });

        describe('GET /hotspots/{hotspotId}/messages', async () => {
            it('should return a collection of message for a given hotspot', async () => {
                // Act
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .set('Accept', 'application/json')
                    .expect(200);

                expect(response.body).to.have.lengthOf(1);
            });

            it("should return 404 if hotspot doesn't exist", async () => {
                // Act
                const hotspotId = 'not-found-id';
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(404);
            });
        });

        describe('POST /hotspots/{hotspotId}/messages', async () => {
            it('should create a new message and return 201 and the new message', async () => {
                // Arrange
                const body = createMessageBody;
                // Act
                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(201);

                expect(response.body.title).to.equal(newMessageResponse(hotspotId).title);
                expect(response.body.body).to.equal(newMessageResponse(hotspotId).body);
                expect(response.body.author)
                    .to.have.property('pseudo')
                    .to.eql(username);
                expect(response.body.pinned).to.equal(false);
            });

            it("should return 404 if hotspot doesn't exist", async () => {
                // Arrange
                hotspotId = 'not-found-id';
                const body = createMessageBody;
                // Act
                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(404);
            });

            it('should return 401 if request body is invalid', async () => {
                // Arrange
                const body = { foo: 'bar' };
                // Act
                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(400);
            });
        });

        describe('PATCH /hotspots/{hotspotId}/messages/{messageId}', async () => {
            let messageId: string;
            let hotspotId: string;

            before(() => {
                messageId = MessageSample.SIMCITY_TOEDIT_MESSAGE.id;
                hotspotId = MediaHotspotSample.TOEDIT.id;
            });

            it('should patch a message and respond 200', async () => {
                // Arrange
                const body = patchMessageBody;
                // Act
                const response = await request(server)
                    .patch(`/hotspots/${hotspotId}/messages/${messageId}`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(200);

                expect(response.body.title).to.eql(editedMessageResponse().title);
                expect(response.body.body).to.eql(editedMessageResponse().body);
                expect(response.body.pinned).to.eql(editedMessageResponse().pinned);
            });

            it('should return 404 if invalid messageId is provided', async () => {
                // Arrange
                const body = patchMessageBody;
                messageId = 'fake-message-id';
                // Act
                const response = await request(server)
                    .patch(`/hotspots/${hotspotId}/messages/${messageId}`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(404);
            });

            it('should return 400 if patch request body is incorrect', async () => {
                // Arrange
                const body = {
                    foo: 'bar',
                };
                messageId = 'fake-message-id';
                // Act
                const response = await request(server)
                    .patch(`/hotspots/${hotspotId}/messages/${messageId}`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(400);
            });
        });
    });
};
export default messagesEndpointsTests;
