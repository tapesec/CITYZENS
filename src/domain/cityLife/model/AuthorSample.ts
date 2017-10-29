import CityzenSample from '../../cityzens/model/CityzenSample';
import Author from './Author';


class AuthorSample {
    public static LOUISE : Author = new Author(CityzenSample.LOUISE.pseudo);
    public static MARTIN : Author = new Author(CityzenSample.MARTIN.pseudo);
    public static ELODIE : Author = new Author(CityzenSample.ELODIE.pseudo);
}

export default AuthorSample;
