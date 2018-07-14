import * as ajv from 'ajv';
import { expect } from 'chai';
import * as request from 'supertest';
import { alertHotspotSchema } from '../../src/api/requestValidation/responseHotspotsSchema';
import AlertHotspotSample from '../../src/domain/cityLife/model/sample/AlertHotspotSample';
import * as server from './../../src/api/server';
import { AlertHotspotPostBody } from './sample/requests-responses';

const alertHotspotsTests = (state: any) => {
    describe('AlertHotspot behavior', () => {
        let newPostHotspot: any;
        const validator: ajv.Ajv = new ajv();
        let alertMessage: string;
        let pictureDescription: string;

        it("Should'nt create AlertHotspot, because of missing properties", async () => {
            const badAlertHotspotBody = { ...AlertHotspotPostBody };
            delete badAlertHotspotBody.message;

            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(badAlertHotspotBody)
                .set('Accept', 'application/json');

            expect(response.badRequest, response.text).to.be.true;
        });

        it("Should'nt create AlertHotspot, because of an additional properties", async () => {
            const badAlertHotspotBody = { ...AlertHotspotPostBody, UneProprieteenTrop: ':(' };

            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(badAlertHotspotBody)
                .set('Accept', 'application/json');

            expect(response.badRequest, response.text).to.be.true;
        });

        it('Should create an AlertHotspot and return it with status 201', async () => {
            // Act
            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(AlertHotspotPostBody)
                .set('Accept', 'application/json')
                .expect(201);

            // Assert
            const isValid = validator.validate(alertHotspotSchema, response.body);
            expect(isValid, validator.errorsText()).to.be.true;
            newPostHotspot = response.body;
        });
        // check if (hotspot correctly retrieved from database)
        it('Should get previously created AlertHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(alertHotspotSchema, response.body);
            expect(isValid).to.be.true;
        });

        it('Should test updating all allowed properties', async () => {
            alertMessage = 'an updated message';
            pictureDescription = 'a-fake-url';
            const response = await request(server)
                .patch(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({
                    pictureDescription,
                    message: alertMessage,
                })
                .set('Accept', 'application/json')
                .expect(200);

            const isValid = validator.validate(alertHotspotSchema, response.body);
            expect(isValid).to.be.true;
            expect(response.body.message)
                .to.have.property('content')
                .to.equal(alertMessage);
            expect(response.body.message).to.have.property('updatedAt');
            expect(response.body)
                .to.have.property('pictureDescription')
                .to.equal(pictureDescription);
        });

        // check if (hotspot correctly retrieved from database)
        it('Should get previously updated hotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(alertHotspotSchema, response.body);
            expect(isValid).to.be.true;
            expect(response.body.message)
                .to.have.property('content')
                .to.equal(alertMessage);
            expect(response.body.message).to.have.property('updatedAt');
            expect(response.body)
                .to.have.property('pictureDescription')
                .to.equal(pictureDescription);
        });

        it('Should delete previously created AlertHotpsot.', async () => {
            const response = await request(server)
                .delete(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json');
            const response2 = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json');

            expect(response.ok, response.text).to.be.true;
            expect(response2.notFound, response2.text).to.be.true;
        });
    });

    describe('PATCH Hotspot no matter type.', () => {
        it('Should return 404.', async () => {
            const hotspotId = 'fake';
            const response = await request(server)
                .patch(`/hotspots/${hotspotId}`)
                .set('Authorization', `Bearer ${state.standard.access_token}`)
                .send({ title: 'foo' })
                .expect(404);
        });

        it('Should return 400 on bad request.', async () => {
            const badBody = { foo: 'bar', trash: ':(' };
            const hotspotId = AlertHotspotSample.TO_READ_ALERT_HOTSPOT_FOR_TU.id;

            const response = await request(server)
                .patch(`/hotspots/${hotspotId}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(badBody)
                .expect(400);
        });
    });
};

export default alertHotspotsTests;
