import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import HotspotCtrl from '../controllers/HotspotCtrl';
import * as restify from 'restify';
import { HOTSPOT_ENDPOINT, VIEWS_ENDPOINT } from './constants';

class HotspotRouter {

    private ctrl : HotspotCtrl;

    constructor(controller: HotspotCtrl) {
        this.ctrl = controller;
    }

    bind(server : restify.Server) {

        server.get(
            HOTSPOT_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.hotspots,
        );

        server.post(
            HOTSPOT_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.postHotspots,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + VIEWS_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.countView,
        );

        server.patch(
            HOTSPOT_ENDPOINT + '/:hotspotId',
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.patchHotspots,
        );

        server.del(
            HOTSPOT_ENDPOINT + '/:hotspotId',
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.removeHotspot,
        );
    }
}

export default HotspotRouter;
