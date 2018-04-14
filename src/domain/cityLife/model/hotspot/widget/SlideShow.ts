import { Url } from 'url';
import ImageUrl from '../../ImageUrl';
import Widget, { WidgetType } from './Widget';
import Author from '../../author/Author';
import WidgetId from './WidgetId';

class SlideShow extends Widget {
    constructor(_id: WidgetId, _author: Author, private _images: [ImageUrl, string][]) {
        super(WidgetType.SLIDE_SHOW, _id, _author);
    }

    public insertInPlace(url: ImageUrl, description: string, index: number) {
        if (
            this._images.find((image, i, obj) => {
                return url.isEqual(image[0]);
            })
        ) {
            throw new Error('Object already present.');
        }

        this._images.splice(index, 0, [url, description]);
    }
    public insert(url: ImageUrl, description: string) {
        this.insertInPlace(url, description, this._images.length);
    }
    public remove(url: ImageUrl) {
        for (let i = 0; i < this._images.length; i += 1) {
            if (this._images[i][0].isEqual(url)) {
                this._images.splice(i, 1);
                return;
            }
        }
    }
    public makeNth(url: ImageUrl, n: number) {
        let index = -1;
        let image;

        for (let i = 0; i < this._images.length; i += 1) {
            if (this._images[i][0].isEqual(url)) {
                index = i;
                image = this._images[index];
                break;
            }
        }

        if (index === -1) {
            throw new Error('Object not present.');
        }

        this.remove(url);
        this.insertInPlace(image[0], image[1], n);
    }

    public get images() {
        return this._images;
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            images: this._images.map(x => [x[0].toString(), x[1]]),
        };
    }
}

export default SlideShow;
