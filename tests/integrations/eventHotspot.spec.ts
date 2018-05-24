import * as ajv from 'ajv';
import { expect } from 'chai';
import * as request from 'supertest';
import { mediaHotspotSchema } from '../../src/api/requestValidation/responseHotspotsSchema';
import { HotspotScope } from '../../src/domain/cityLife/model/hotspot/Hotspot';
import * as server from './../../src/api/server';
import { MediaHotspotPostBody } from './sample/requests-responses';

const eventHotspotsTests = (state: any) => {
    describe('EventHotspot behavior', () => {
        //
        let newPostHotspot: any;
        const validator: ajv.Ajv = new ajv();

        let hotspotScope;
        let hotspotTitle;
        let dateEnd;
        let description;
        let avatarIconUrl;
        let slideShow;

        it('Should create a EventHotspot and return it with status 201', async () => {
            // Act
            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(MediaHotspotPostBody)
                .set('Accept', 'application/json')
                .expect(201);

            // Assert
            const isValid = validator.validate(mediaHotspotSchema, response.body);
            expect(isValid, validator.errorsText()).to.be.true;
            newPostHotspot = response.body;
        });

        it('Should get previously created EventHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json');
            expect(response.ok, response.text).to.be.true;

            // Assert
            const isValid = validator.validate(mediaHotspotSchema, response.body);
            expect(isValid).to.be.true;
        });

        it('Should test updating all allowed properties', async () => {
            hotspotScope = HotspotScope.Private;
            hotspotTitle = 'an updated title';
            dateEnd = '0650-05-31T21:00:00.000Z';
            avatarIconUrl = 'new-url';
            slideShow = ['slide(-1)', 'slide(sqrt(5) + 1)'];

            const response = await request(server)
                .patch(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({
                    avatarIconUrl,
                    slideShow,
                    scope: hotspotScope,
                    title: hotspotTitle,
                })
                .set('Accept', 'application/json');
            expect(response.ok, response.text).to.be.true;

            const isValid = validator.validate(mediaHotspotSchema, response.body);
            expect(isValid).to.be.true;
            expect(response.body)
                .to.have.property('avatarIconUrl')
                .to.equal(avatarIconUrl);
            expect(response.body)
                .to.have.property('scope')
                .to.equal(hotspotScope);
            expect(response.body)
                .to.have.property('title')
                .to.equal(hotspotTitle);
            expect(response.body)
                .to.have.property('slideShow')
                .to.be.deep.equal(slideShow);
        });

        it('Should get previously updated MediaHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(mediaHotspotSchema, response.body);
            expect(isValid).to.be.true;
            expect(response.body)
                .to.have.property('avatarIconUrl')
                .to.equal(avatarIconUrl);
            expect(response.body)
                .to.have.property('scope')
                .to.equal(hotspotScope);
            expect(response.body)
                .to.have.property('title')
                .to.equal(hotspotTitle);
            expect(response.body)
                .to.have.property('slideShow')
                .to.be.deep.equal(slideShow);
        });
    });
};

export default eventHotspotsTests;
