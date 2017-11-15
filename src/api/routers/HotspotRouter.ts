import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import HotspotCtrl from '../controllers/HotspotCtrl';
import * as restify from 'restify';
import { HOTSPOT_ENDPOINT } from './constants';

class HotspotRouter {

    private ctrl : HotspotCtrl;

    constructor(controller: HotspotCtrl) {
        this.ctrl = controller;
    }

    bind(server : restify.Server) {

        server.get(
            HOTSPOT_ENDPOINT,
            // this.ctrl.loadAuthenticatedUser,
            this.ctrl.hotspots,
        );
    }
}

export default HotspotRouter;
