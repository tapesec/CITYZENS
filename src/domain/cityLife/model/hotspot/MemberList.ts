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

    public add(cityzenId: string) {
        this._memberSet.add(cityzenId);
    }
    public has(cityzenId: string) {
        return this._memberSet.has(cityzenId);
    }
    public delete(cityzenId: string) {
        if (this.has(cityzenId)) this._memberSet.delete(cityzenId);
    }

    public toString() {
        return this.toArray();
    }
}

export default MemberList;
