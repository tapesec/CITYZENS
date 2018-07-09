import * as Chai from 'chai';
import * as request from 'supertest';
import AlertHotspotSample from '../../src/domain/cityLife/model/sample/AlertHotspotSample';
import * as server from './../../src/api/server';

export const votingPath = state => {
    describe('Voting path.', () => {
        it('Should return AlertHotspot with right voters.', async () => {
            const hotspotId = AlertHotspotSample.TOEDIT_CAMELOT.id;

            const response = await request(server)
                .get(`/hotspots/${hotspotId}`)
                .expect(200);

            Chai.expect(response.body)
                .to.have.property('voterList')
                .to.have.length(2);
        });

        it('Should vote on alertHotspot.', async () => {
            const hotspotId = AlertHotspotSample.TOEDIT_CAMELOT.id;

            const response = await request(server)
                .post(`/hotspots/${hotspotId}/pertinence`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({ agree: true })
                .expect(200);

            Chai.expect(response.body)
                .to.have.property('voterList')
                .to.have.length(3);
        });
        it('Should return already voted.', async () => {
            const hotspotId = AlertHotspotSample.TOEDIT_CAMELOT.id;

            const response = await request(server)
                .post(`/hotspots/${hotspotId}/pertinence`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({ agree: true });

            Chai.expect(response.badRequest, response.text).to.be.true;
        });
    });
};
