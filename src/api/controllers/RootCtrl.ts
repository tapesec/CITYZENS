import DecodedJwtPayload from '../services/auth/DecodedJwtPayload';
import Cityzen from './../../domain/cityzens/model/Cityzen';
import JwtParser from './../services/auth/JwtParser';
import * as r from 'restify';
import config from './../config/index';
import * as ajv from 'ajv';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR ,getStatusText } from 'http-status-codes';
import SlackWebhook from '../libs/SlackWebhook';
const request = require('request');
const logs = require('./../../logs/');
const restifyErrors = require('restify-errors');
const httpResponseDataLogger = logs.get('http-response-data');

class RootCtrl {

    protected _decodedJwtPayload : DecodedJwtPayload;
    protected jwtParser : JwtParser;
    protected schemaValidator : ajv.Ajv = new ajv();
    private hook: SlackWebhook;

    constructor(jwtParser? : JwtParser) {
        if (jwtParser) this.jwtParser = jwtParser;
        this.hook = new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request);
    }

    public loadAuthenticatedUser = async (req : r.Request, res : r.Response, next : r.Next) => {

        if (!req.header('Authorization')) {
            return next(new restifyErrors.UnauthorizedError('Token must be provided'));
        }
        const token = req.header('Authorization').slice(7);
        try {
            const decodedToken : any = await this.jwtParser.verify(token);
            const namespace = config.auth.auth0JwtPayloadNamespace;
            this._decodedJwtPayload = new DecodedJwtPayload(decodedToken, namespace);
            return next();
        } catch (err) {
            return next(new restifyErrors.UnauthorizedError(err.message));
        }
    }

    public nextInternalError(next: r.Next, err: JSON, route: String, exceptionMsg?: String) {
        httpResponseDataLogger.info(err);
        this.hook.alert(`Error 500 on ${route} \n ${JSON.stringify(err)}`);
        next(new restifyErrors.InternalServerError( 
            exceptionMsg || getStatusText(INTERNAL_SERVER_ERROR)));
    }

    get decodedJwtPayload() : DecodedJwtPayload {
        return this._decodedJwtPayload;
    }
}
export default RootCtrl;
