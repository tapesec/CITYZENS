import SlackWebhook from './../../libs/SlackWebhook';
import config from './../../config';
import {
    BAD_REQUEST, UNAUTHORIZED, getStatusText,
} from 'http-status-codes';

const request = require('request');
const restifyErrors = require('restify-errors');
const logs = require('./../../../logs');
const httpLogger = logs.get('http-response-data');

class ErrorHandler {

    private slackHook : SlackWebhook;
    private resitfyErrors: any;
    private httpLogger : any;

    constructor(slackHook: SlackWebhook, httpLogger: any, restifyErrors: any) {
        this.slackHook = slackHook;
        this.httpLogger = httpLogger;
        this.resitfyErrors = restifyErrors;
    }

    logSlack(route: string, msg ?: string) {
        this.slackHook.alert(
            `Error on ${route} \n ${
                (msg !== undefined) ? msg : ''
            } \n
            Call trace: ${(new Error()).stack}`,
        );
    }

    logAndCreateBadRequest(route: string, pMsg?: string) {
        const msg = (pMsg === undefined) ? getStatusText(BAD_REQUEST) : pMsg;

        const error = new this.resitfyErrors.BadRequestError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateUnautorized(route: string, pMsg?: string) {
        const msg = (pMsg === undefined) ? getStatusText(UNAUTHORIZED) : pMsg;

        const error = new this.resitfyErrors.UnauthorizedError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateInvalidCredentials(route: string, pMsg?: string) {
        const msg = (pMsg === undefined) ? getStatusText(UNAUTHORIZED) : pMsg;

        const error = new this.resitfyErrors.InvalidCredentialsError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateNotFound(route: string, pMsg?: string) {
        const msg = (pMsg === undefined) ? getStatusText(UNAUTHORIZED) : pMsg;

        const error = new this.resitfyErrors.NotFoundError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateInternal(route: string, err?: any) {
        const error = new this.resitfyErrors.InternalServerError(
            (err !== undefined) ? err : '',
        );

        const errorToLog = (err !== undefined) ? JSON.stringify(err, undefined, 4) : err;

        if (errorToLog !== undefined) this.httpLogger.info(errorToLog);
        this.slackHook.alert(
            `Error 500 on ${route} \n ${
                (errorToLog !== undefined) ? errorToLog : ''
            } \n
             Call trace: ${error.stack}`,
        );
        return error;
    }


}

const errorHandler = new ErrorHandler(
    new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request),
    httpLogger,
    restifyErrors,
);
export { errorHandler };
export default ErrorHandler;


