import Widget from './Widget';

class WidgetList {
    constructor(private _list: Widget[]) {}

    public get list() {
        return this._list;
    }

    public insert(widget: Widget) {
        this._list.push(widget);
    }

    public toJSON() {
        return this._list.map(x => x.toJSON());
    }
}

export default WidgetList;
