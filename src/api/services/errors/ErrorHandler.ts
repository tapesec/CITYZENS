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
    
    logAndCreateBadRequest(route: String, pMsg?: String) {
        const msg = (pMsg === undefined) ? getStatusText(BAD_REQUEST) : pMsg;
        
        const error = new this.resitfyErrors.BadRequestError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateUnautorized(route: String, pMsg?: String) {
        const msg = (pMsg === undefined) ? getStatusText(UNAUTHORIZED) : pMsg;
        
        const error = new this.resitfyErrors.UnauthorizedError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateInvalidCredentials(route: String, pMsg?: String) {
        const msg = (pMsg === undefined) ? getStatusText(UNAUTHORIZED) : pMsg;
        
        const error = new this.resitfyErrors.InvalidCredentialsError(
            msg,
        );

        this.httpLogger.info(msg);
        return error;
    }

    logAndCreateNotFound(route: String, pMsg?: String) {
        const msg = (pMsg === undefined) ? getStatusText(UNAUTHORIZED) : pMsg;

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

export default ErrorHandler;


