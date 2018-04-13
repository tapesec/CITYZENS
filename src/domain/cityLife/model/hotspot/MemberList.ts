import Cityzen from '../../../cityzens/model/Cityzen';
import ValueObject from './../../../interface/ValueObject';
import * as lodash from 'lodash';
import CityzenId from '../../../cityzens/model/CityzenId';
class MemberList implements ValueObject {
    private _memberSet: Set<CityzenId>;

    constructor(members?: CityzenId[]) {
        if (members !== undefined) this._memberSet = new Set<CityzenId>(members);
        else this._memberSet = new Set<CityzenId>();
    }

    public get member(): Set<CityzenId> {
        return this._memberSet;
    }

    public toArray(): CityzenId[] {
        return Array.from(this._memberSet);
    }

    public add(cityzenId: CityzenId) {
        this._memberSet.add(cityzenId);
    }
    public has(cityzenId: CityzenId) {
        return this._memberSet.has(cityzenId);
    }
    public delete(cityzenId: CityzenId) {
        if (this.has(cityzenId)) this._memberSet.delete(cityzenId);
    }
    public get size() {
        return this._memberSet.size;
    }

    public isEqual(other: MemberList) {
        return lodash.isEqual(this, other);
    }

    public toJSON(): string[] {
        return this.toArray().map(x => x.toString());
    }
}

export default MemberList;
