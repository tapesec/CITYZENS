import ValueObject from '../../../interface/ValueObject';
import * as lodash from 'lodash';
import CityzenId from '../../../cityzens/model/CityzenId';

class VoterList implements ValueObject {
    private _list: Map<CityzenId, boolean>;
    constructor(list?: any) {
        this._list = new Map<CityzenId, boolean>(list);
    }

    public delete(id: CityzenId) {
        this._list.delete(id);
    }

    public add(id: CityzenId, doAgree: boolean) {
        this._list.set(id, doAgree);
    }

    public has(id: CityzenId) {
        this._list.has(id);
    }

    public didAgree(id: CityzenId) {
        return this._list.get(id);
    }

    get list(): Map<CityzenId, boolean> {
        return this._list;
    }

    public isEqual(other: VoterList) {
        return lodash.isEqual(this, other);
    }
}

export default VoterList;
