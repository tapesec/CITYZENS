import Hotspot from '../../domain/cityLife/model/Hotspot';
import HotspotCtrl from '../controllers/HotspotCtrl';
import * as restify from 'restify';
import { HOTSPOT_ENDPOINT } from './constants';

class HotspotRouter {

    private ctrl : HotspotCtrl;

    constructor(controller: HotspotCtrl) {
        this.ctrl = controller;
    }

    bind(server : restify.Server) {
        /**
         * @swagger
         * /hotspots:
         *   get:
         *     tags:
         *       - Hotspots
         *     parameters:
         *     - name: north
         *       in: query
         *       description: the latitude north of the area
         *       required: false
         *       schema:
         *          type: float
         *     - name: west
         *       in: query
         *       description: the longitude west of the area
         *       required: false
         *       schema:
         *          type: float
         *     - name: south
         *       in: query
         *       description: the latitude south of the area
         *       required: false
         *       schema:
         *          type: float
         *     - name: east
         *       in: query
         *       description: the longitude east of the area
         *       required: false
         *       schema:
         *          type: float
         *     description: Returns all hotspots
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: An array of cityzens's hotspots
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/definitions/Hotspots'
         */

        /**
         * @swagger
         * definition:
         *   Hotspots:
         *     properties:
         *       id:
         *         type: string
         *         format: uuid
         *       title:
         *         type: string
         *       position:
         *         type: object
         *         properties:
         *           latitude:
         *             type: double
         *           longitude:
         *             type: double
         *       author:
         *         type: object
         *         properties:
         *           pseudo:
         *             type: string
         *       content:
         *         type: object
         *         properties:
         *           message:
         *             type: string
         *           createdAt:
         *             type: date
         *           updatedAt:
         *             type: date
         */
        server.get(
            HOTSPOT_ENDPOINT,
            this.ctrl.loadAuthenticatedUser,
            this.ctrl.hotspots,
        );
    }
}

export default HotspotRouter;
