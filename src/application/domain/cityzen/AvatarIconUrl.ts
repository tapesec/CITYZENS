import ValueObject from '../ValueObject';
import * as lodash from 'lodash';

class AvatarIconUrl implements ValueObject {
    constructor(private _url: string) {}

    public get url() {
        return this._url;
    }

    public isEqual(other: AvatarIconUrl) {
        return lodash.isEqual(this, other);
    }

    public toString() {
        return this._url;
    }
}

export default AvatarIconUrl;
