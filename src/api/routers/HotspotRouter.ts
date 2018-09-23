import * as restify from 'restify';
import HotspotCtrl from '../controllers/HotspotCtrl';
import { ALERT_PERTINENCE, HOTSPOT_ENDPOINT, VIEWS_ENDPOINT } from './constants';
import UserLoader from '../middlewares/UserLoader';

class HotspotRouter {
    constructor(private ctrl: HotspotCtrl, private userLoader: UserLoader) {}

    bind(server: restify.Server) {
        server.get(HOTSPOT_ENDPOINT, this.userLoader.optInAuthenticateUser, this.ctrl.hotspots);

        server.get(
            HOTSPOT_ENDPOINT + '/:hotspotId',
            this.userLoader.optInAuthenticateUser,
            this.ctrl.getHotspot,
        );

        server.post(
            HOTSPOT_ENDPOINT,
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.postHotspots,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + VIEWS_ENDPOINT,
            this.userLoader.optInAuthenticateUser,
            this.ctrl.countView,
        );

        server.post(
            HOTSPOT_ENDPOINT + '/:hotspotId' + ALERT_PERTINENCE,
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.postPertinence,
        );

        server.patch(
            HOTSPOT_ENDPOINT + '/:hotspotId',
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.patchHotspots,
        );

        server.del(
            HOTSPOT_ENDPOINT + '/:hotspotId',
            this.userLoader.loadAuthenticatedUser,
            this.ctrl.removeHotspot,
        );
    }
}

export default HotspotRouter;
