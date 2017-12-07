import MessageSample from '../../src/domain/cityLife/model/sample/MessageSample';
import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import PositionSample from './../../src/domain/cityLife/model/sample/PositionSample';
import { createMessageBody } from './sample/requests-bodies';
import { newMessageResponse } from './sample/responses-sample';

const messagesEndpointsTests = (state : any) => {

    describe('/messages endpoint', () => {

        describe('GET /hotspots/{hotspotId}/messages', () => {

            it ('should return a collection of message for a given hotspot', async () => {
                // Arrange
                const hotspotId = MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.hotspotId.id;
                // Act
                const response = await request(server)
                .get(`/hotspots/${hotspotId}/messages`)
                .set('Authorization', `Bearer ${state.id_token}`)
                .set('Accept', 'application/json')
                .expect(200);

                expect(response.body).to.have.lengthOf(1);
            });

            it ('should return 404 if hotspot doesn\'t exist', async () => {
                // Arrange
                const hotspotId = 'not-found-hotspot-id';
                // Act
                const response = await request(server)
                .get(`/hotspots/${hotspotId}/messages`)
                .set('Authorization', `Bearer ${state.id_token}`)
                .set('Accept', 'application/json')
                .expect(404);
            });
        });

        describe('POST /hotspots/{hotspotId}/messages', () => {

            it ('should create a new message and return 201 and the new message', async () => {
                // Arrange
                const hotspotId = MessageSample.MARTIGNAS_TOWNHALL_MESSAGE.hotspotId.id;
                const body = createMessageBody;
                // Act
                const response = await request(server)
                .post(`/hotspots/${hotspotId}/messages`)
                .send(body)
                .set('Authorization', `Bearer ${state.id_token}`)
                .set('Accept', 'application/json')
                .expect(201);

                expect(response.body).to.eql(newMessageResponse());
            });
        });
    });
};
export default messagesEndpointsTests;
