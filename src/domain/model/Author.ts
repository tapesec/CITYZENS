import CityzenId from '../cityzens/model/CityzenId';
import ImageLocation from './ImageLocation';

class Author {
    protected _pseudo: string;
    protected _id: CityzenId;
    protected _pictureExtern: ImageLocation;
    protected _pictureCityzen: ImageLocation;

    constructor(
        pseudo: string,
        id: CityzenId,
        pictureExtern: ImageLocation,
        pictureCityzen: ImageLocation,
    ) {
        this._pseudo = pseudo;
        this._id = id;
        this._pictureCityzen = pictureCityzen;
        this._pictureExtern = pictureExtern;
    }

    get pictureCityzen(): ImageLocation {
        return this._pictureCityzen;
    }
    get pictureExtern(): ImageLocation {
        return this._pictureExtern;
    }

    get pseudo(): string {
        return this._pseudo;
    }

    get id(): CityzenId {
        return this._id;
    }

    toJSON() {
        return {
            pictureCityzen: this.pictureCityzen.toString(),
            pictureExtern: this.pictureExtern.toString(),
            pseudo: this._pseudo,
            id: this._id.toString(),
        };
    }

    public isEqual(other: Author) {
        return other.id.isEqual(this.id);
    }
}

export default Author;
