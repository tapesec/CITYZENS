import * as rest from 'restify';
import CityzenCtrl from '../controllers/CityzenCtrl';
import { CITYZEN_ENDPOINT } from './constants';

class CityzenRouter {
    constructor(private ctrl: CityzenCtrl) {}

    bind(server: rest.Server) {
        server.get(
            CITYZEN_ENDPOINT + '/:cityzenId',
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.cityzen,
        );
    }
}

export default CityzenRouter;
