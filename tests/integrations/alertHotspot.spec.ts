import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import * as ajv from 'ajv';
import { AlertHotspotPostBody } from './sample/requests-responses';
import { HotspotScope } from '../../src/domain/cityLife/model/hotspot/Hotspot';
import { alertHotspotSchema } from '../../src/api/requestValidation/responseHotspotsSchema';
import AlertHotspotSample from '../../src/domain/cityLife/model/sample/AlertHotspotSample';

const alertHotspotsTests = (state: any) => {
    describe('AlertHotspot behavior', () => {
        let newPostHotspot: any;
        const validator: ajv.Ajv = new ajv();
        let alertMessage: string;
        let alertHotspotImgLocation: string;

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
            alertHotspotImgLocation = 'a-fake-url';
            const response = await request(server)
                .patch(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({
                    alertHotspotImgLocation,
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
                .to.have.property('imageDescriptionLocation')
                .to.equal(alertHotspotImgLocation);
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
                .to.have.property('imageDescriptionLocation')
                .to.equal(alertHotspotImgLocation);
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
