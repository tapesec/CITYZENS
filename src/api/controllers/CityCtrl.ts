import * as rest from 'restify';
import { OK } from 'http-status-codes';
import City from '../../application/domain/city/City';
import CitySample from '../../application/domain/sample/CitySample';
import RootCtrl from './RootCtrl';
import Territoire from '../../application/domain/city/ICityRepository';

class CityCtrl extends RootCtrl {
    private cityRepository: Territoire;

    public static INSEE_NOT_FOUND = 'invalid insee code';
    public static SLUG_NOT_FOUND = 'invalid slug name';

    constructor(cityRepositoryInMemory: Territoire) {
        super();
        this.cityRepository = cityRepositoryInMemory;
        this.cityRepository.conquerirUneVille(CitySample.MARTIGNAS);
    }

    // method=GET url=/cities/{slug}
    public city = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const askedCity: City = this.cityRepository.trouverUneVilleParSlug(req.params.slug);
            if (askedCity) {
                res.json(OK, askedCity);
            } else {
                return next(this.responseError.logAndCreateNotFound(req, CityCtrl.SLUG_NOT_FOUND));
            }
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}

export default CityCtrl;
