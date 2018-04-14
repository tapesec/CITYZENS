import WidgetFactory from '../../../src/infrastructure/WidgetFactory';
import * as Chai from 'chai';
import Widget, { WidgetType } from '../../../src/domain/cityLife/model/hotspot/widget/Widget';
import SlideShow from '../../../src/domain/cityLife/model/hotspot/widget/SlideShow';
import ImageUrl from '../../../src/domain/cityLife/model/ImageUrl';
import CityzenId from '../../../src/domain/cityzens/model/CityzenId';
import WidgetId from '../../../src/domain/cityLife/model/hotspot/widget/WidgetId';

describe('Widget factory.', () => {
    it('Should build a widget from POST data.', () => {
        const data = {
            type: WidgetType.SLIDE_SHOW,
            images: [['url', 'desc'], ['url2', 'desc2']],
            author: {
                pseudo: 'pseudo',
                id: 'id',
            },
        };

        const widget = WidgetFactory.build(data.type, data);

        Chai.expect(widget).to.have.property('id');
        Chai.expect(widget)
            .to.have.property('type')
            .to.be.equal(WidgetType.SLIDE_SHOW);
        Chai.expect(widget)
            .to.have.property('author')
            .to.have.property('pseudo')
            .to.be.equal('pseudo');
        Chai.expect(widget)
            .to.have.property('author')
            .to.have.property('id')
            .to.be.deep.equal(new CityzenId('id'));
        Chai.expect(widget instanceof SlideShow).to.be.true;
        Chai.expect(widget as SlideShow).to.have.property('images');
        Chai.expect((widget as SlideShow).images).to.have.lengthOf(2);
        Chai.expect((widget as SlideShow).images[0][0]).to.be.deep.equal(new ImageUrl('url'));
        Chai.expect((widget as SlideShow).images[0][1]).to.be.equal('desc');
        Chai.expect((widget as SlideShow).images[1][0]).to.be.deep.equal(new ImageUrl('url2'));
        Chai.expect((widget as SlideShow).images[1][1]).to.be.equal('desc2');
    });

    it('Should build a widget from database.', () => {
        const data = {
            id: 'widget id',
            type: WidgetType.SLIDE_SHOW,
            images: [['url', 'desc'], ['url2', 'desc2']],
            author: {
                pseudo: 'pseudo',
                id: 'id',
            },
        };

        const widget = WidgetFactory.build(data.type, data);

        Chai.expect(widget)
            .to.have.property('id')
            .to.be.deep.equal(new WidgetId('widget id'));
        Chai.expect(widget)
            .to.have.property('type')
            .to.be.equal(WidgetType.SLIDE_SHOW);
        Chai.expect(widget)
            .to.have.property('author')
            .to.have.property('pseudo')
            .to.be.equal('pseudo');
        Chai.expect(widget)
            .to.have.property('author')
            .to.have.property('id')
            .to.be.deep.equal(new CityzenId('id'));
        Chai.expect(widget instanceof SlideShow).to.be.true;
        Chai.expect(widget as SlideShow).to.have.property('images');
        Chai.expect((widget as SlideShow).images).to.have.lengthOf(2);
        Chai.expect((widget as SlideShow).images[0][0]).to.be.deep.equal(new ImageUrl('url'));
        Chai.expect((widget as SlideShow).images[0][1]).to.be.equal('desc');
        Chai.expect((widget as SlideShow).images[1][0]).to.be.deep.equal(new ImageUrl('url2'));
        Chai.expect((widget as SlideShow).images[1][1]).to.be.equal('desc2');
    });
});
