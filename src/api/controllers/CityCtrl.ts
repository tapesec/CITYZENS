import { OK } from 'http-status-codes';
import * as rest from 'restify';

import UseCaseStatus from '../../application/usecases/UseCaseStatus';
import VilleParSlug from '../../application/usecases/VilleParSlug';
import RootCtrl from './RootCtrl';

class CityCtrl extends RootCtrl {
    public static INSEE_NOT_FOUND = 'invalid insee code';
    public static SLUG_NOT_FOUND = 'invalid slug name';

    constructor(protected villeParSlug: VilleParSlug) {
        super();
    }

    // method=GET url=/cities/{slug}
    public city = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const useCaseResult = await this.villeParSlug.run(req.params.slug);
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(this.responseError.logAndCreateNotFound(req, CityCtrl.SLUG_NOT_FOUND));
            }
            res.json(OK, useCaseResult.city);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}

export default CityCtrl;
