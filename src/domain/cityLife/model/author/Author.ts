import { OutgoingMessage } from 'http';
import CityzenId from '../../../cityzens/model/CityzenId';

class Author {
    protected _pseudo: string;
    protected _id: CityzenId;

    constructor(pseudo: string, id: CityzenId) {
        this._pseudo = pseudo;
        this._id = id;
    }

    get pseudo(): string {
        return this._pseudo;
    }

    get id(): CityzenId {
        return this._id;
    }

    toJSON() {
        return {
            pseudo: this._pseudo,
            id: this._id.toString(),
        };
    }

    public isEqual(other: Author) {
        return other.id.isEqual(this.id);
    }
}

export default Author;
