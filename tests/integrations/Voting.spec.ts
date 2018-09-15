import * as Chai from 'chai';
import * as request from 'supertest';
import * as server from './../../src/api/server';
import { AlertHotspotPostBody } from './sample/requests-responses';

export const votingPath = (state: any) => {
    describe('Voting path.', () => {
        let hotspotToVote;
        it('Should create a new AlertHotspot to vote on.', async () => {
            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(AlertHotspotPostBody)
                .set('Accept', 'application/json');

            Chai.expect(response.ok, response.text).to.be.true;

            hotspotToVote = response.body.id;
        });

        it('Should return AlertHotspot with right voters.', async () => {
            const response = await request(server)
                .get(`/hotspots/${hotspotToVote}`)
                .expect(200);

            Chai.expect(response.body)
                .to.have.property('voterList')
                .to.have.length(0);
        });

        it('Should vote on alertHotspot.', async () => {
            const response = await request(server)
                .post(`/hotspots/${hotspotToVote}/pertinence`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({ agree: true });

            Chai.expect(response.ok, response.text).to.be.true;

            Chai.expect(response.body)
                .to.have.property('voterList')
                .to.have.length(1);
        });
        it('Should return already voted.', async () => {
            const response = await request(server)
                .post(`/hotspots/${hotspotToVote}/pertinence`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({ agree: true });

            Chai.expect(response.badRequest, response.text).to.be.true;
        });
        it('Should delete previously created hotspot.', async () => {
            const response = await request(server)
                .delete(`/hotspots/${hotspotToVote}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json');
            const response2 = await request(server)
                .get(`/hotspots/${hotspotToVote}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json');

            Chai.expect(response.ok, response.text).to.be.true;
            Chai.expect(response2.notFound, response2.text).to.be.true;
        });
    });
};
