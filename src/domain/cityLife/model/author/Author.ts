class Author {

    protected _pseudo : string;
    protected _email : string;

    constructor(pseudo : string, email : string) {
        this._pseudo = pseudo;
        this._email = email;
    }

    get pseudo() : string {
        return this._pseudo;
    }

    toJSON() {
        return {
            pseudo: this._pseudo,
            email: this._email,
        };
    }
}

export default Author;
