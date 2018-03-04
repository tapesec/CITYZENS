import Cityzen from '../../../cityzens/model/Cityzen';

class MemberList {
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

    public add(c: string) {
        this._memberSet.add(c);
    }
    public has(c: string) {
        return this._memberSet.has(c);
    }
    public delete(c: string) {
        if (this.has(c)) this._memberSet.delete(c);
    }

    public toString() {
        return this.toArray();
    }
}

export default MemberList;
