import * as lodash from 'lodash';
import CityzenId from '../../../cityzens/model/CityzenId';
import ValueObject from '../../../interface/ValueObject';

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
        let flag = false;
        this._list.forEach((_, k) => {
            if (flag) return;
            if (k.isEqual(id)) flag = true;
        });
        return flag;
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

    public toJSON() {
        return Array.from(this.list);
    }
}

export default VoterList;
