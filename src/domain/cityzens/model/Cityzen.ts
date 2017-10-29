class Cityzen {

    protected _email : string;
    protected _pseudo : string;

    constructor(email : string, pseudo : string) {
        this._email = email;
        this._pseudo = pseudo;
    }

    get email() : string {
        return this._email;
    }

    get pseudo() : string {
        return this._pseudo;
    }

    toJSON() {
        return {
            email: this._email,
            pseudo: this._pseudo,
        };
    }
}

export default Cityzen;
