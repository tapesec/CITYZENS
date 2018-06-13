import CityzenSample from './../../../cityzens/model/CityzenSample';
import Author from './../author/Author';

class AuthorSample {
    public static MARTIN: Author = new Author(
        CityzenSample.MARTIN.pseudo,
        CityzenSample.MARTIN.id,
        CityzenSample.MARTIN.pictureExtern,
        CityzenSample.MARTIN.pictureCityzen,
    );
    public static LOUISE: Author = new Author(
        CityzenSample.LOUISE.pseudo,
        CityzenSample.LOUISE.id,
        CityzenSample.LOUISE.pictureExtern,
        CityzenSample.LOUISE.pictureCityzen,
    );
    public static ELODIE: Author = new Author(
        CityzenSample.ELODIE.pseudo,
        CityzenSample.ELODIE.id,
        CityzenSample.ELODIE.pictureExtern,
        CityzenSample.ELODIE.pictureCityzen,
    );
    public static LUCA: Author = new Author(
        CityzenSample.LUCA.pseudo,
        CityzenSample.LUCA.id,
        CityzenSample.LUCA.pictureExtern,
        CityzenSample.LUCA.pictureCityzen,
    );
    public static LIONNEL: Author = new Author(
        CityzenSample.LIONNEL.pseudo,
        CityzenSample.LIONNEL.id,
        CityzenSample.LIONNEL.pictureExtern,
        CityzenSample.LIONNEL.pictureCityzen,
    );
}

export default AuthorSample;
