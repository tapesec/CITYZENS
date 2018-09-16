import ImageLocation from '../hotspot/ImageLocation';
import CityzenId from './CityzenId';

class Cityzen {
    protected _id: CityzenId;
    protected _email: string;
    protected _pseudo: string;
    protected _isAdmin: boolean;
    protected _description: string;
    protected _pictureExtern: ImageLocation;
    protected _pictureCityzen: ImageLocation;
    protected _favoritesHotspots: Set<string>;
    protected _createdAt: Date;

    constructor(
        id: CityzenId,
        email: string,
        pseudo: string,
        isAdmin: boolean,
        favoritesHotspots: Set<string>,
        description: string,
        pictureExtern: ImageLocation,
        pictureCityzen: ImageLocation,
        createdAt: Date,
    ) {
        this._id = id;
        this._email = email;
        this._pseudo = pseudo;
        this._isAdmin = isAdmin;
        this._favoritesHotspots = favoritesHotspots;
        this._description = description;
        this._pictureExtern = pictureExtern;
        this._pictureCityzen = pictureCityzen;
        this._createdAt = createdAt;
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

    get pictureCityzen(): ImageLocation {
        return this._pictureCityzen;
    }

    get pictureExtern(): ImageLocation {
        return this._pictureExtern;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    editDescription(newDescription: string): void {
        this._description = newDescription;
    }

    editPictureLocation(newPictureLocation: ImageLocation) {
        this._pictureCityzen = newPictureLocation;
    }

    addHotspotAsFavorit(hotspotId: string): void {
        if (!this._favoritesHotspots) {
            this._favoritesHotspots = new Set<string>();
        }
        this._favoritesHotspots.add(hotspotId);
    }

    toJSON() {
        return {
            id: this.id.toString(),
            email: this.email,
            pseudo: this.pseudo,
            isAdmin: this.isAdmin,
            description: this.description,
            pictureExtern: this.pictureExtern.toString(),
            pictureCityzen: this.pictureCityzen.toString(),
            favoritesHotspots: JSON.stringify(Array.from(this.favoritesHotspots)),
            createdAt: this.createdAt.toJSON(),
        };
    }
}

export default Cityzen;
