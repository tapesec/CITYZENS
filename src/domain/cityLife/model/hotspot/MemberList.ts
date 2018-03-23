import Cityzen from '../../../cityzens/model/Cityzen';
import ValueObject from './../../../interface/ValueObject';
import * as lodash from 'lodash';
class MemberList implements ValueObject {
    private _memberSet: Set<string>;

    constructor(members?: string[]) {
        if (members !== undefined) this._memberSet = new Set<string>(members);
        else this._memberSet = new Set<string>();
    }

    public get member(): Set<string> {
        return this._memberSet;
    }

    public toArray(): string[] {
        return Array.from(this._memberSet);
    }

    public add(cityzenId: string) {
        this._memberSet.add(cityzenId);
    }
    public has(cityzenId: string) {
        return this._memberSet.has(cityzenId);
    }
    public delete(cityzenId: string) {
        if (this.has(cityzenId)) this._memberSet.delete(cityzenId);
    }

    public isEqual(other: MemberList) {
        return lodash.isEqual(this, other);
    }

    public toString(): string[] {
        return this.toArray();
    }
}

export default MemberList;
