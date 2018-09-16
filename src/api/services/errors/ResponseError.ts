import * as rest from 'restify';
import { BAD_REQUEST, UNAUTHORIZED, getStatusText } from 'http-status-codes';
import {
    BadRequestError,
    UnauthorizedError,
    InvalidCredentialsError,
    NotFoundError,
    InternalServerError,
} from 'restify-errors';
const requestIp = require('request-ip');
import { Webhook, getWebhook } from './../../libs/SlackWebhook';
import { MCDVLogger, getlogger } from './../../libs/MCDVLogger';
import { MCDVLoggerEvent } from '../../libs/MCDVLogger';

class ResponseError {
    private slackHook: Webhook;
    private httpLogger: MCDVLogger;

    constructor() {
        this.slackHook = getWebhook();
        this.httpLogger = getlogger();
    }

    private extractRequestMetadata(req: rest.Request) {
        return {
            clientIp: requestIp.getClientIp(req),
            userAgent: req.userAgent(),
            route: req.getRoute(),
            query: req.query,
            params: req.params,
            body: req.body,
            requestStart: req.time(),
            headers: {
                authorization: req.header('Authorization'),
            },
        };
    }

    logSlack(route: string, msg?: string) {
        this.slackHook.alert(
            `Error on ${route} \n ${msg !== undefined ? msg : ''} \n
            Call trace: ${new Error().stack}`,
        );
    }

    logAndCreateBadRequest(req: rest.Request, pMsg?: string, metadata: Object = {}) {
        const msg = pMsg === undefined ? getStatusText(BAD_REQUEST) : pMsg;
        const mdata = { ...metadata, request: this.extractRequestMetadata(req) };
        const error = new BadRequestError(msg);
        this.httpLogger.info(MCDVLoggerEvent.BAD_REQUEST, msg, mdata);
        return error;
    }

    logAndCreateUnautorized(req: rest.Request, pMsg?: string, metadata: Object = {}) {
        const msg = pMsg === undefined ? getStatusText(UNAUTHORIZED) : pMsg;
        const mdata = { ...metadata, request: this.extractRequestMetadata(req) };
        const error = new UnauthorizedError(msg);
        this.httpLogger.info(MCDVLoggerEvent.UNAUTHORIZED, msg, mdata);
        return error;
    }

    logAndCreateInvalidCredentials(req: rest.Request, pMsg?: string, metadata: Object = {}) {
        const msg = pMsg === undefined ? getStatusText(UNAUTHORIZED) : pMsg;
        const mdata = { ...metadata, request: this.extractRequestMetadata(req) };
        const error = new InvalidCredentialsError(msg);
        this.httpLogger.info(MCDVLoggerEvent.INVALID_CREDENTIALS, msg, mdata);
        return error;
    }

    logAndCreateNotFound(req: rest.Request, pMsg?: string, metadata: Object = {}) {
        const msg = pMsg === undefined ? getStatusText(UNAUTHORIZED) : pMsg;
        const mdata = { ...metadata, request: this.extractRequestMetadata(req) };
        const error = new NotFoundError(msg);
        this.httpLogger.info(MCDVLoggerEvent.NOT_FOUD, msg, mdata);
        return error;
    }

    logAndCreateInternal(req: rest.Request, err?: Error, metadata: Object = {}) {
        const error = new InternalServerError(err.message);
        const errorToLog = JSON.stringify(err.message, undefined, 4);
        const mdata = { ...metadata, request: this.extractRequestMetadata(req) };
        if (errorToLog !== undefined) {
            this.httpLogger.error(MCDVLoggerEvent.UNEXPECTED_ERROR, errorToLog, mdata);
        }
        this.slackHook
            .alert(
                `Error 500 ${JSON.stringify(mdata)} \n ${
                    errorToLog !== undefined ? errorToLog : ''
                } \n
                Call trace: ${err.stack ? err.stack : 'not available'}`,
            )
            .catch(r => {});
        return error;
    }
}

export default ResponseError;
