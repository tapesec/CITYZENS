import * as ajv from 'ajv';
import ResponseError from '../services/errors/ResponseError';
import { getlogger, MCDVLogger } from '../libs/MCDVLogger';

class RootCtrl {
    protected responseError: ResponseError;
    protected logger: MCDVLogger;
    protected schemaValidator: ajv.Ajv;

    constructor() {
        this.responseError = new ResponseError();
        this.logger = getlogger();
        this.schemaValidator = new ajv({ allErrors: true });
    }
}
export default RootCtrl;
