import { expect } from 'chai';
import * as request from 'supertest';
import * as server from '../../src/api/server';

const cityzenTest = (state: any) => {
    describe('/cityzens endpoint', () => {
        describe('GET /cityzens/{cityzenID}', () => {
            it('Should return a Cityzen with correct user_id', async () => {
                const cityzenId = '5';
                const provider = 'auth0';
                const response = await request(server)
                    .get('/cityzens/' + cityzenId)
                    .query({ provider })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');

                expect(response.ok, response.text).to.be.true;
                expect(response.body)
                    .to.have.property('id')
                    .to.be.equal(`${provider}|${cityzenId}`);

                expect(response.body).to.not.have.property('password');
            });

            it("Shouldn'nt return a Cityzen, and should return unauthorized.", async () => {
                const cityzenId = 'auth0|5';

                const response = await request(server)
                    .get('/cityzens/' + cityzenId)
                    .set('Accept', 'application/json');

                expect(response.unauthorized, response.text).to.be.true;
            });
        });
    });
};

export default cityzenTest;
