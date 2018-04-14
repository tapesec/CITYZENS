import ValueObject from '../../../interface/ValueObject';
import ImageLocation from './ImageLocation';
import * as lodash from 'lodash';

class SlideShow implements ValueObject {
    constructor(private _list?: ImageLocation[]) {
        if (_list === undefined) this._list = [];
    }

    public get list() {
        return this._list;
    }

    public toString() {
        return this._list.toString();
    }

    public isEqual(other: SlideShow) {
        return lodash.isEqual(this, other);
    }

    public toJSON() {
        return this._list;
    }
}

export default SlideShow;
