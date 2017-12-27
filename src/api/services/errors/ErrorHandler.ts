import * as restify from 'restify';
import SlackWebhook from 'src/api/libs/SlackWebhook';
import { 
    BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED, getStatusText, 
} from 'http-status-codes';

class ErrorHandler {

    private slackHook : SlackWebhook;
    private resitfyErrors: any;
    private httpLogger : any; 

    constructor(slackHook: SlackWebhook, httpLogger: any, restifyErrors: any) {
        this.slackHook = slackHook;
        this.httpLogger = httpLogger;
        this.resitfyErrors = restifyErrors;
    }
    
    logAndCreateBadRequest(route: String, msg?: String) {
        if (msg === undefined) msg = getStatusText(BAD_REQUEST);
        const error = new this.resitfyErrors.BadRequestError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateUnautorized(route: String, msg?: String) {
        if (msg === undefined) msg = getStatusText(UNAUTHORIZED);
        const error = new this.resitfyErrors.UnauthorizedError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateInvalidCredentials(route: String, msg?: String) {
        if (msg === undefined) msg = getStatusText(UNAUTHORIZED);
        const error = new this.resitfyErrors.InvalidCredentialsError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateNotFound(route: String, msg?: String) {
        if (msg === undefined) msg = getStatusText(NOT_FOUND);
        const error = new this.resitfyErrors.NotFoundError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateInternal(route: String, err?: any) {
        const error = new this.resitfyErrors.InternalServerError(
            (err !== undefined) ? err : '',
        );

        if (err !== undefined){
            err = JSON.stringify(err, undefined, 4)
        }

        if (err !== undefined) this.httpLogger.info(err);
        this.slackHook.alert(
            `Error 500 on ${route} \n ${
                (err !== undefined) ? err : ''
            } \n 
             Call trace: ${error.stack}`,
        );
        return error;
    }


}

export default ErrorHandler;


