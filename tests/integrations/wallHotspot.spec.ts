import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import * as ajv from 'ajv';
import { WallHotspotPostBody } from './sample/requests-responses';
import { HotspotScope } from '../../src/domain/cityLife/model/hotspot/Hotspot';
import { wallHotspotSchema } from '../../src/api/requestValidation/responseHotspotsSchema';

const wallHotspotsTests = (state: any) => {
    describe('WallHotspot behavior', () => {
        // wallHotspotSchema
        let newPostHotspot: any;
        const validator: ajv.Ajv = new ajv();

        let hotspotScope;
        let hotspotTitle;
        let avatarIconUrl;

        it('Should create a WallHotspot and return it with status 201', async () => {
            // Act
            const response = await request(server)
                .post('/hotspots')
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(WallHotspotPostBody)
                .set('Accept', 'application/json')
                .expect(201);

            // Assert
            const isValid = validator.validate(wallHotspotSchema, response.body);
            expect(isValid).to.be.true;
            newPostHotspot = response.body;
        });

        it('Should get previously created WallHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(wallHotspotSchema, response.body);
            expect(isValid).to.be.true;
        });

        it('Should test updating all allowed properties', async () => {
            hotspotScope = HotspotScope.Private;
            hotspotTitle = 'an updated title';
            avatarIconUrl = 'new-url';

            const response = await request(server)
                .patch(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send({
                    avatarIconUrl,
                    scope: hotspotScope,
                    title: hotspotTitle,
                })
                .set('Accept', 'application/json')
                .expect(200);

            const isValid = validator.validate(wallHotspotSchema, response.body);
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
        });

        it('Should get previously updated WallHotspot with GET request by id', async () => {
            // Act
            const response = await request(server)
                .get(`/hotspots/${newPostHotspot.id}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .set('Accept', 'application/json')
                .expect(200);

            // Assert
            const isValid = validator.validate(wallHotspotSchema, response.body);
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
        });
    });
};

export default wallHotspotsTests;
