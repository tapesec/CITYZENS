import Cityzen from '../../../cityzens/model/Cityzen';
import ValueObject from './../../../interface/ValueObject';
<<<<<<< HEAD
import * as lodash from 'lodash';
=======

>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
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
<<<<<<< HEAD
        return lodash.isEqual(this, other);
=======
        return other.member === this.member;
>>>>>>> e5585c8d190beab0611c1211c22d24d23fb831a3
    }

    public toString(): string[] {
        return this.toArray();
    }
}

export default MemberList;
