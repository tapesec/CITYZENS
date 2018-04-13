import ValueObject from './../../interface/ValueObject';
import * as lodash from 'lodash';

class ImageUrl {
    constructor(private _url: string) {}

    public get url() {
        return this._url;
    }

    public isEqual(other: ImageUrl) {
        return lodash.isEqual(this, other);
    }

    public toString() {
        return this._url;
    }
}

export default ImageUrl;
