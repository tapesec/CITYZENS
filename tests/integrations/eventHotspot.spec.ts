import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import * as ajv from 'ajv';
import { EventHotspotPostBody } from './sample/requests-responses';
import { HotspotScope } from '../../src/domain/cityLife/model/hotspot/Hotspot';
import { eventHotspotSchema } from '../../src/api/requestValidation/responseHotspotsSchema';

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

        it('Should create an EventHotspot and return it with status 201', async () => {
            // Act
            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(EventHotspotPostBody)
                .set('Accept', 'application/json')
                .expect(201);

            // Assert
            const isValid = validator.validate(eventHotspotSchema, response.body);
            expect(isValid).to.be.true;
            newPostHotspot = response.body;
        });

        it('Should get previously created EventHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(eventHotspotSchema, response.body);
            expect(isValid).to.be.true;
        });

        it('Should test updating all allowed properties', async () => {
            hotspotScope = HotspotScope.Private;
            hotspotTitle = 'an updated title';
            dateEnd = '0650-05-31T21:00:00.000Z';
            description = 'an updated description';
            avatarIconUrl = 'new-url';

            const response = await request(server)
                .patch(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({
                    avatarIconUrl,
                    description,
                    dateEnd,
                    scope: hotspotScope,
                    title: hotspotTitle,
                })
                .set('Accept', 'application/json')
                .expect(200);

            const isValid = validator.validate(eventHotspotSchema, response.body);
            expect(isValid).to.be.true;
            expect(response.body)
                .to.have.property('avatarIconUrl')
                .to.equal(avatarIconUrl);
            expect(response.body)
                .to.have.property('description')
                .to.have.property('content')
                .to.equal(description);
            expect(response.body)
                .to.have.property('dateEnd')
                .to.equal(dateEnd);
            expect(response.body)
                .to.have.property('scope')
                .to.equal(hotspotScope);
            expect(response.body)
                .to.have.property('title')
                .to.equal(hotspotTitle);
        });

        it('Should get previously updated EventHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(eventHotspotSchema, response.body);
            expect(isValid).to.be.true;
            expect(response.body)
                .to.have.property('avatarIconUrl')
                .to.equal(avatarIconUrl);
            expect(response.body)
                .to.have.property('description')
                .to.have.property('content')
                .to.equal(description);
            expect(response.body)
                .to.have.property('dateEnd')
                .to.equal(dateEnd);
            expect(response.body)
                .to.have.property('scope')
                .to.equal(hotspotScope);
            expect(response.body)
                .to.have.property('title')
                .to.equal(hotspotTitle);
        });
    });
};

export default eventHotspotsTests;
