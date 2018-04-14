import Widget, { WidgetType } from '../domain/cityLife/model/hotspot/widget/Widget';
import SlideShow from '../domain/cityLife/model/hotspot/widget/SlideShow';
import WidgetId from '../domain/cityLife/model/hotspot/widget/WidgetId';
import Author from '../domain/cityLife/model/author/Author';
import CityzenId from '../domain/cityzens/model/CityzenId';
import ImageUrl from '../domain/cityLife/model/ImageLocation';
import * as uuid from 'uuid';

class WidgetFactory {
    public static build(type: WidgetType, data: any): Widget {
        let id: WidgetId;
        let author: Author;

        if (data.id === undefined) {
            id = new WidgetId(uuid.v4());
        } else {
            id = new WidgetId(data.id);
        }

        if (data.author instanceof Author) {
            author = data.author;
        } else {
            author = new Author(data.author.pseudo, new CityzenId(data.author.id));
        }

        switch (type) {
            case WidgetType.SLIDE_SHOW: {
                return this.buildSlideShow(id, author, data);
            }
        }
    }

    private static buildSlideShow(id: WidgetId, author: Author, data: any): SlideShow {
        const images = data.images.map((x: [string, number]) => {
            return [new ImageUrl(x[0]), x[1]];
        });

        return new SlideShow(id, author, images);
    }
}

export default WidgetFactory;
