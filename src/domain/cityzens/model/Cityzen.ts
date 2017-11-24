class Cityzen {

    protected _id : string;
    protected _email : string;
    protected _pseudo : string;
    protected _description : string;
    protected _favoritesHotspots : string[];

    constructor(
        id : string, 
        email : string, 
        pseudo : string,
        favoritesHotspots? : string[],
        description? : string,
    ) {
        this._id = id;
        this._email = email;
        this._pseudo = pseudo;
        if (favoritesHotspots) {
            this._favoritesHotspots = favoritesHotspots;
        }
        if (description) {
            this._description = description;
        }
    }

    get id() : string {
        return this._id;
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

    get favoritesHotspots() : string[] {
        return this._favoritesHotspots;
    }

    editDescription(newDescription : string) : void {
        this._description = newDescription;
    }

    addHotspotAsFavorit(hotspotId : string) : void {
        if (!this._favoritesHotspots) {
            this._favoritesHotspots = [];
        }
        this._favoritesHotspots.push(hotspotId);
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            pseudo: this.pseudo,
            description: this.description,
            favoritesHotspots: this.favoritesHotspots,
        };
    }
}

export default Cityzen;
