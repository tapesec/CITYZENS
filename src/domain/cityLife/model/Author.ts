class Author {

    protected _pseudo : string;

    constructor(pseudo : string) {
        this._pseudo = pseudo;
    }

    get pseudo() : string {
        return this._pseudo;
    }

    toJSON() {
        return {
            pseudo: this._pseudo,
        };
    }
}

export default Author;
