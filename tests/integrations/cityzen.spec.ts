import { expect } from 'chai';
import * as request from 'supertest';
import * as server from '../../src/api/server';
import CityzenSample from '../../src/application/domain/sample/CityzenSample';

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

            it("Should'nt return a Cityzen but not found.", async () => {
                const cityzenId = '99';
                const provider = 'auth0';
                const response = await request(server)
                    .get('/cityzens/' + cityzenId)
                    .query({ provider })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');
                expect(response.notFound, response.text).to.be.true;
            });
        });

        describe('PATCH /cityzens/{cityzenID}', () => {
            it('Should patch a Cityzen according to given payload', async () => {
                const martin = CityzenSample.MARTIN;
                const cityzenId = martin.id.toString().split('|')[1];
                const provider = 'auth0';
                const response = await request(server)
                    .patch('/cityzens/' + cityzenId)
                    .query({ provider })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json')
                    .send({
                        description: 'Courage Martin',
                        pictureCityzen: 'KI9EVeOiS3KbqA5G7es2', // random filestack handle
                    });
                expect(response.ok, response.text).to.be.true;
                expect(response.body)
                    .to.have.property('id')
                    .to.be.equal(`${provider}|${cityzenId}`);
                expect(response.body)
                    .to.have.property('description')
                    .to.be.equal('Courage Martin');
                expect(response.body)
                    .to.have.property('pictureCityzen')
                    .to.be.equal('KI9EVeOiS3KbqA5G7es2');

                expect(response.body).to.not.have.property('password');
            });

            it("Should'nt patch the cityzen if body is invalid", async () => {
                const martin = CityzenSample.MARTIN;
                const cityzenId = martin.id.toString().split('|')[1];
                const provider = 'auth0';
                const response = await request(server)
                    .patch('/cityzens/' + cityzenId)
                    .query({ provider })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json')
                    .send({
                        badParams: 'Courage Martin',
                    });
                expect(response.badRequest, response.text).to.be.true;
            });
            it("Should'nt patch the cityzen if this one is not found", async () => {
                const martin = CityzenSample.MARTIN;
                const cityzenId = '19';
                const provider = 'auth0';
                const response = await request(server)
                    .patch('/cityzens/' + cityzenId)
                    .query({ provider })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json')
                    .send({
                        description: 'Courage Martin',
                    });
                expect(response.notFound, response.text).to.be.true;
            });

            /* it("Shouldn'nt return a Cityzen, and should return unauthorized.", async () => {
                const cityzenId = 'auth0|5';

                const response = await request(server)
                    .get('/cityzens/' + cityzenId)
                    .set('Accept', 'application/json');

                expect(response.unauthorized, response.text).to.be.true;
            });

            it("Should'nt return a Cityzen but not found.", async () => {
                const cityzenId = '99';
                const provider = 'auth0';
                const response = await request(server)
                    .get('/cityzens/' + cityzenId)
                    .query({ provider })
                    .set('Authorization', `Bearer ${state.admin.access_token}`)
                    .set('Accept', 'application/json');
                expect(response.notFound, response.text).to.be.true;
            }); */
        });
    });
};

export default cityzenTest;
