import Author from '../../author/Author';
import WidgetId from './WidgetId';

enum WidgetType {
    SLIDE_SHOW,
}

class Widget {
    constructor(protected _type: WidgetType, protected _id: WidgetId, protected _author: Author) {}

    get type() {
        return this._type;
    }

    public toJSON() {
        return {
            type: this._type.valueOf(),
            id: this._id.toString(),
            author: this._author.toJSON(),
        };
    }
}

export default Widget;
export { WidgetType };
