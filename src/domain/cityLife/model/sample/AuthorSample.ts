import CityzenSample from '../../../cityzens/model/CityzenSample';
import Author from '../author/Author';


class AuthorSample {
    public static LOUISE : Author = 
    new Author(CityzenSample.LOUISE.pseudo, CityzenSample.LOUISE.email);
    public static MARTIN : Author = 
    new Author(CityzenSample.MARTIN.pseudo, CityzenSample.MARTIN.email);
    public static ELODIE : Author = 
    new Author(CityzenSample.ELODIE.pseudo, CityzenSample.ELODIE.email);
}

export default AuthorSample;
