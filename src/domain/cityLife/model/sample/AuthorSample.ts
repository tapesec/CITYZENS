import CityzenSample from './../../../cityzens/model/CityzenSample';
import Author from './../author/Author';

class AuthorSample {
    public static MARTIN: Author = new Author(CityzenSample.MARTIN.pseudo, CityzenSample.MARTIN.id);
    public static LOUISE: Author = new Author(CityzenSample.LOUISE.pseudo, CityzenSample.LOUISE.id);
    public static ELODIE: Author = new Author(CityzenSample.ELODIE.pseudo, CityzenSample.ELODIE.id);
    public static LUCA: Author = new Author(CityzenSample.LUCA.pseudo, CityzenSample.LUCA.id);
    public static LIONNEL: Author = new Author(
        CityzenSample.LIONNEL.pseudo,
        CityzenSample.LIONNEL.id,
    );
}

export default AuthorSample;
