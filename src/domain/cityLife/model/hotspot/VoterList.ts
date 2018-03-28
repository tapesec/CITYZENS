import ValueObject from '../../../interface/ValueObject';
import * as lodash from 'lodash';

class VoterList implements ValueObject {
    private _list: Map<string, boolean>;
    constructor(list?: any) {
        this._list = new Map<string, boolean>(list);
    }

    public delete(id: string) {
        this._list.delete(id);
    }

    public add(id: string, doAgree: boolean) {
        this._list.set(id, doAgree);
    }

    public has(id: string) {
        this._list.has(id);
    }

    public didAgree(id: string) {
        return this._list.get(id);
    }

    get list(): Map<string, boolean> {
        return this._list;
    }

    public isEqual(other: VoterList) {
        return lodash.isEqual(this, other);
    }
}

export default VoterList;
