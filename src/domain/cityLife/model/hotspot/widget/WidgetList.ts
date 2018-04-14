import Widget, { WidgetType } from './Widget';

class WidgetList {
    constructor(private _list: Widget[]) {}

    public get list() {
        return this._list;
    }

    public insert(widget: Widget) {
        this._list.push(widget);
    }

    public allOf(type: WidgetType) {
        return this._list.filter((w, i) => {
            return w.type === type;
        });
    }

    public toJSON() {
        return this._list.map(x => x.toJSON());
    }
}

export default WidgetList;
