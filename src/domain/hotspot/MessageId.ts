import * as lodash from 'lodash';

export default class MessageId {
    constructor(private _id: string) {}

    public get id() {
        return this._id;
    }

    public toString() {
        return this.id;
    }

    public isEqual(other: MessageId) {
        return lodash.isEqual(this, other);
    }
}
