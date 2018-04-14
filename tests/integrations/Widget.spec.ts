import * as server from './../../src/api/server';
import * as request from 'supertest';
import * as ajv from 'ajv';
import * as Chai from 'chai';
import WallHotspotSample from '../../src/domain/cityLife/model/sample/WallHotspotSample';
import { postSlideShow } from './sample/requests-responses';
import * as widgetSchema from './responseSchema/widget';
import { WidgetType } from '../../src/domain/cityLife/model/hotspot/widget/Widget';

export const widgetPath = state => {
    describe('Widget functionality.', () => {
        let validator: ajv.Ajv;

        before(() => {
            validator = new ajv();
        });

        it('Should post a new widget to an hotspot.', async () => {
            const hotspotId = WallHotspotSample.TOEDIT.id;
            const body = postSlideShow;

            const response = await request(server)
                .post(`/hotspots/${hotspotId}/widgets`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .send(body)
                .expect(200);

            Chai.expect(response.body).to.have.property('widgets');
            response.body.widgets.forEach(w => {
                validator.validate(widgetSchema.widget, w);
            });
        });

        it('Should get all widget from an hotspot.', async () => {
            const hotspotId = WallHotspotSample.TOEDIT.id;

            const response = await request(server)
                .get(`/hotspots/${hotspotId}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .expect(200);

            Chai.expect(response.body).to.have.property('widgets');
            response.body.widgets.forEach(w => {
                validator.validate(widgetSchema.widget, w);
            });
        });

        it('Should get a SlideShow from an hotspot.', async () => {
            const hotspotId = WallHotspotSample.TOEDIT.id;

            const response = await request(server)
                .get(`/hotspots/${hotspotId}/widgets/${WidgetType.SLIDE_SHOW}`)
                .set('Authorization', `Bearer ${state.admin.access_token}`)
                .expect(200);

            validator.validate(widgetSchema.widgetsResponse, response.body);
        });
    });
};
