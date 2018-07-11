import { expect } from 'chai';
import * as request from 'supertest';
import MessageSample from '../../src/domain/cityLife/model/sample/MessageSample';
import * as server from './../../src/api/server';
import { username } from './sample/granted-cityzen';
import {
    commentPostBody,
    createMessageBody,
    editedMessageResponse,
    newMessageResponse,
    patchMessageBody,
} from './sample/requests-responses';

const messagesEndpointsTests = (state: any) => {
    describe('/messages endpoint', () => {
        let hotspotId: string;
        let messagePostedId: string;

        beforeEach(() => {
            hotspotId = MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.hotspotId.id;
        });

        describe('GET /hotspots/{hotspotId}/messages', async () => {
            let commentPosted;

            it('Should post a comment to make sure the returned commentCount is correct.', async () => {
                // Arrange
                const body = { body: 'blo' };
                const messageId = MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.id.toString();
                // Act
                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages/${messageId}/comments`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;

                commentPosted = response.body.id;
            });

            it('Should return incorrect request.', async () => {
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .query({
                        count: true,
                        riri: 'fifi',
                    })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.badRequest, response.text).to.be.true;
            });

            it('Should return correct comment count.', async () => {
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .query({
                        count: true,
                        messages: [MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.id.toString()].join(
                            ',',
                        ),
                    })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body)
                    .to.have.property(MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.id.toString())
                    .to.be.equal('1');
            });

            it('Should delete previous comment.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${hotspotId}/messages/${commentPosted}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
            });
        });
        describe('GET /hotspots/{hotspotId}/messages', async () => {
            it('should return a collection of message for a given hotspot', async () => {
                // Act
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
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
                expect(response.body).to.have.property('id');
                messagePostedId = response.body.id;
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

        describe('GET /hotspots/{hotspotId}/messages', () => {
            it('should return previous posted message', async () => {
                // Act
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body).to.have.lengthOf(2);
                let flag = false;

                for (const message of response.body) {
                    if (message.body === createMessageBody.body) {
                        flag = true;
                    }
                }

                expect(flag).to.be.true;
            });
        });

        describe('PATCH /hotspots/{hotspotId}/messages/{messageId}', async () => {
            it('should patch previously created message and respond 200', async () => {
                // Arrange
                const body = patchMessageBody;
                // Act
                const response = await request(server)
                    .patch(`/hotspots/${hotspotId}/messages/${messagePostedId}`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body.title).to.eql(editedMessageResponse().title);
                expect(response.body.body).to.eql(editedMessageResponse().body);
                expect(response.body.pinned).to.eql(editedMessageResponse().pinned);
            });

            it('should return previous patched message', async () => {
                // Act
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body).to.have.lengthOf(2);
                let flag = false;

                for (const message of response.body) {
                    if (message.body === patchMessageBody.body) {
                        flag = true;
                    }
                }

                expect(flag).to.be.true;
            });

            it('should return 404 if invalid messageId is provided', async () => {
                // Arrange
                const body = patchMessageBody;
                const messageId = 'fake-message-id';
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
                const messageId = 'fake-message-id';
                // Act
                const response = await request(server)
                    .patch(`/hotspots/${hotspotId}/messages/${messageId}`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.standard.access_token}`)
                    .set('Accept', 'application/json')
                    .expect(400);
            });
        });

        describe('DELETE /hotspots/{hotspotId}/messages/{messageId}', () => {
            it('Should delete previously create message.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${hotspotId}/messages/${messagePostedId}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
            });
        });

        describe('Should delete all comments from message when it is deleted.', () => {
            let messageId;
            let commentId;
            it('Post messages.', async () => {
                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages`)
                    .send({ body: 'lala' })
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${state.admin.access_token}`);

                expect(response.ok, response.text).to.be.true;

                messageId = response.body.id;
            });
            it('Post comments.', async () => {
                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages/${messageId}/comments`)
                    .send({ body: 'lala' })
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${state.admin.access_token}`);
                expect(response.ok, response.text).to.be.true;

                commentId = response.body.id;
            });
            it('Delete message.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${hotspotId}/messages/${messageId}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
            });
            it('Check deletion.', async () => {
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages`)
                    .set('Accept', 'application/json');

                const array = response.body.map(x => x.id);
                expect(response.ok, response.text).to.be.true;
                expect(array, array).to.not.include(commentId);
            });
        });

        describe('POST a comment', () => {
            let commentPosted;
            const hotspotToComment = MessageSample.MARTIGNAS_CHURCH_MESSAGE.hotspotId.toString();
            const messageToComment = MessageSample.MARTIGNAS_CHURCH_MESSAGE.id.toString();
            it('Should post a comment on a message.', async () => {
                const body = commentPostBody;

                const response = await request(server)
                    .post(`/hotspots/${hotspotId}/messages/${commentPostBody.parentId}/comments`)
                    .send(body)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                commentPosted = response.body.id;
            });

            it('Should get previously posted comment.', async () => {
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages/${messageToComment}/comments`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body).to.have.lengthOf(1);
                expect(response.body[0])
                    .to.have.property('body')
                    .to.be.equal(commentPostBody.body);
            });

            it('Should delete previously posted comment.', async () => {
                const response = await request(server)
                    .delete(`/hotspots/${hotspotId}/messages/${commentPosted}`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
            });

            it('Should return no comments.', async () => {
                const response = await request(server)
                    .get(`/hotspots/${hotspotId}/messages/${messageToComment}/comments`)
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body).to.have.lengthOf(0);
            });
        });
    });
};
export default messagesEndpointsTests;
