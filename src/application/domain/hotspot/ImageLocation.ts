import * as lodash from 'lodash';

class ImageLocation {
    constructor(private _url?: string) {}

    get url() {
        return this._url;
    }

    toString() {
        return this._url;
    }

    isEqual(other: ImageLocation) {
        return lodash.isEqual(this, other);
    }
}

export default ImageLocation;
