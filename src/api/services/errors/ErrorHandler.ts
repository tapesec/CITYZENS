import * as restify from 'restify';
import SlackWebhook from 'src/api/libs/SlackWebhook';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR ,getStatusText } from 'http-status-codes';

const logs = require('./../../../logs/');
const restifyError = require('restify-errors');
const httpResponseDataLogger = logs.get('http-response-data');

class ErrorHandler {

    private slackHook : SlackWebhook;

    constructor(slackHook: SlackWebhook) {
        this.slackHook = slackHook;
    }

    logInternal(err: String, route: String, next: restify.Next, msg?: String) {
        httpResponseDataLogger.info(err);
        this.slackHook.alert(
            `Error 500 on ${route} \n ${JSON.stringify(err, undefined, 4)} \n 
             Call trace: ${new Error().stack}`);
        return new restifyError.InternalServerError(
            msg || getStatusText(INTERNAL_SERVER_ERROR));
    }

}

export default ErrorHandler;


