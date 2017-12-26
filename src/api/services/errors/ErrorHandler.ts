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
        const error = new this.resitfyErrors.BadRequestError(
            msg || getStatusText(BAD_REQUEST),
        );

        this.httpLogger.info(msg || getStatusText(NOT_FOUND));
        return error;
    }

    logAndCreateUnautorized(route: String, msg?: String) {
        const error = new this.resitfyErrors.UnauthorizedError(
            msg || getStatusText(UNAUTHORIZED),
        );

        this.httpLogger.info(msg || getStatusText(NOT_FOUND));
        return error;
    }

    logAndCreateInvalidCredentials(route: String, msg?: String) {
        const error = new this.resitfyErrors.InvalidCredentialsError(
            msg || getStatusText(UNAUTHORIZED),
        );

        this.httpLogger.info(msg || getStatusText(NOT_FOUND));
        return error;
    }

    logAndCreateNotFound(route: String, msg?: String) {
        const error = new this.resitfyErrors.NotFoundError(
            msg || getStatusText(NOT_FOUND),
        );

        this.httpLogger.info(msg || getStatusText(NOT_FOUND));
        return error;
    }

    logAndCreateInternal(route: String, err?: JSON, msg?: String) {
        const error = new this.resitfyErrors.InternalServerError(
            msg || getStatusText(INTERNAL_SERVER_ERROR),
        );

        if (err) this.httpLogger.info(err);
        this.slackHook.alert(
            `Error 500 on ${route} \n ${err ? JSON.stringify(err, undefined, 4) : ''} \n 
             Call trace: ${error.stack}`,
        );
        return error;
    }


}

export default ErrorHandler;


