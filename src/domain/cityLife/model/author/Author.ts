import ValueObject from './../../../interface/ValueObject';
import { OutgoingMessage } from 'http';

class Author implements ValueObject {
    protected _pseudo: string;
    protected _id: string;

    constructor(pseudo: string, id: string) {
        this._pseudo = pseudo;
        this._id = id;
    }

    get pseudo(): string {
        return this._pseudo;
    }

    get id(): string {
        return this._id;
    }

    toJSON() {
        return {
            pseudo: this._pseudo,
            id: this._id,
        };
    }

    public isEqual(other: Author) {
        return other.id === this.id;
    }
}

export default Author;
