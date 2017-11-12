class Cityzen {

    protected _email : string;
    protected _pseudo : string;
    protected _description : string;

    constructor(email : string, pseudo : string, description? : string) {
        this._email = email;
        this._pseudo = pseudo;
        if (description) {
            this._description = description;
        }
    }

    get email() : string {
        return this._email;
    }

    get pseudo() : string {
        return this._pseudo;
    }

    get description() : string {
        return this._description;
    }

    editDescription(newDescription : string) : void {
        this._description = newDescription;
    }

    toJSON() {
        return {
            email: this._email,
            pseudo: this._pseudo,
            description: this._description,
        };
    }
}

export default Cityzen;
