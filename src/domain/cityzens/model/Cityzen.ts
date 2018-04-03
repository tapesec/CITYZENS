import CityzenId from './CityzenId';

class Cityzen {
    protected _id: CityzenId;
    protected _email: string;
    protected _pseudo: string;
    protected _description: string;
    protected _isAdmin: boolean;
    protected _favoritesHotspots: Set<string>;

    constructor(
        id: CityzenId,
        email: string,
        pseudo: string,
        isAdmin: boolean,
        favoritesHotspots?: Set<string>,
        description?: string,
    ) {
        this._id = id;
        this._email = email;
        this._pseudo = pseudo;
        this._isAdmin = isAdmin;
        if (favoritesHotspots) {
            this._favoritesHotspots = favoritesHotspots;
        }
        if (description) {
            this._description = description;
        }
    }

    get id(): CityzenId {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get pseudo(): string {
        return this._pseudo;
    }

    get description(): string {
        return this._description;
    }

    get favoritesHotspots(): Set<string> {
        return this._favoritesHotspots;
    }

    get isAdmin(): boolean {
        return this._isAdmin;
    }

    editDescription(newDescription: string): void {
        this._description = newDescription;
    }

    addHotspotAsFavorit(hotspotId: string): void {
        if (!this._favoritesHotspots) {
            this._favoritesHotspots = new Set<string>();
        }
        this._favoritesHotspots.add(hotspotId);
    }

    toJSON() {
        return {
            id: this.id.toJson(),
            email: this.email,
            pseudo: this.pseudo,
            isAdmin: this.isAdmin,
            description: this.description,
            favoritesHotspots: this.favoritesHotspots,
        };
    }
}

export default Cityzen;
