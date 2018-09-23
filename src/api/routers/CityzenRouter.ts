import * as rest from 'restify';
import CityzenCtrl from '../controllers/CityzenCtrl';
import { CITYZEN_ENDPOINT } from './constants';
import UserLoader from '../middlewares/UserLoader';

class CityzenRouter {
    constructor(private ctrl: CityzenCtrl, protected userLoader: UserLoader) {}

    bind(server: rest.Server) {
        server.get(
            CITYZEN_ENDPOINT + '/:cityzenId',
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.cityzen,
        );

        server.patch(
            CITYZEN_ENDPOINT + '/:cityzenId',
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.patchCityzen,
        );
    }
}

export default CityzenRouter;
