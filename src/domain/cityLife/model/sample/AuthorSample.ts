import CityzenSample from '../../../cityzens/model/CityzenSample';
import Author from '../author/Author';


class AuthorSample {
    public static LOUISE : Author =
    new Author(CityzenSample.LOUISE.pseudo, CityzenSample.LOUISE.id);
    public static MARTIN : Author =
    new Author(CityzenSample.MARTIN.pseudo, CityzenSample.MARTIN.id);
    public static ELODIE : Author =
    new Author(CityzenSample.ELODIE.pseudo, CityzenSample.ELODIE.id);
}

export default AuthorSample;
