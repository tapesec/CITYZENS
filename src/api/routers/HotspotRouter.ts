import Hotspot from '../../domain/cityLife/model/Hotspot';
import HotspotCtrl from '../controllers/HotspotCtrl';
import * as restify from 'restify';
import { HOTSPOT_ENDPOINT } from './constants';
import JwtParser from './../services/auth/JwtParser';
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cityzens.eu.auth0.com/.well-known/jwks.json`,
    }),

  // Validate the audience and the issuer.
    audience: 'https://cityzens.eu.auth0.com/api/v2/',
    issuer: `https://cityzens.eu.auth0.com/`,
    algorithms: ['RS256'],
});
// const jwksRsa = require('jwks-rsa');

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
/* const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cityzens.eu.auth0.com/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: 'https://cityzens.eu.auth0.com/api/v2/',
    issuer: `https://cityzens.eu.auth0.com/`,
    algorithms: ['RS256'],
}); */

class HotspotRouter {

    private ctrl : HotspotCtrl;
    private jwt : JwtParser;

    constructor(jwtService : JwtParser, controller: HotspotCtrl) {
        this.ctrl = controller;
        this.jwt = jwtService;
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
            /* (req : restify.Request, res : restify.Response, next : restify.Next) => {
                const token = req.header('authorisation').slice(7);
                console.log(token);
                this.jwt.verify(token)
                .then((decoded) => {
                    console.log(decoded);
                    next();
                })
                .catch((err) => {
                    next(err);
                });
            } */
            checkJwt,
            this.ctrl.hotspots);
    }
}

export default HotspotRouter;
