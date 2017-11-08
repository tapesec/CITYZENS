import CityCtrl from '../controllers/CityCtrl';
import * as restify from 'restify';
import { CITY_ENDPOINT } from './constants';


class CityRouter {

    private ctrl: CityCtrl;

    constructor(controller: CityCtrl) {
        this.ctrl = controller;
    }

    bind(server: restify.Server) {

        server.get(
            CITY_ENDPOINT + '/:insee', this.ctrl.city,
        );
    }
}

export default CityRouter;
