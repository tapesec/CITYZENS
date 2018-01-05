import DecodedJwtPayload from '../services/auth/DecodedJwtPayload';
import Cityzen from './../../domain/cityzens/model/Cityzen';
import JwtParser from './../services/auth/JwtParser';
import * as r from 'restify';
import config from './../config/index';
import * as ajv from 'ajv';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR ,getStatusText } from 'http-status-codes';
import ErrorHandler from '../services/errors/ErrorHandler';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
const request = require('request');
const logs = require('./../../logs/');
const restifyErrors = require('restify-errors');
const httpResponseDataLogger = logs.get('http-response-data');

class RootCtrl {

    protected schemaValidator : ajv.Ajv = new ajv();
    protected errorHandler: ErrorHandler;
    protected userInfo: Promise<UserInfoAuth0>;
    protected request: any;

    constructor(errorHandler: ErrorHandler, request : any) {
        this.request = request;
        this.errorHandler = errorHandler;
    }

    public loadAuthenticatedUser = async (req : r.Request, res : r.Response, next : r.Next) => {

        if (!req.header('Authorization')) {
            return next(this.errorHandler.logAndCreateUnautorized(
                req.path(), 'Token must be provided',
            ));
        }

        const access_token = req.header('Authorization').slice(7);
        try {
            
            this.userInfo = new Promise((resolve, reject) => {
                const data = {
                    method: 'GET',
                    url: config.auth.auth0url + '/userinfo',
                    headers: { Authorization: `Bearer ${access_token}` },
                };
    
                const callbakck = (err: any, res: any, body: any) => {
                    if (res.statusCode !== 200) {
                        reject(err || body);
                    } else {
                        resolve(new UserInfoAuth0(body));
                    }
                };
    
                this.request(data, callbakck);
            });
            this.userInfo.catch((reason: any) => {console.log(reason);});
            
            return next();
        } catch (err) {
            return next(this.errorHandler.logAndCreateUnautorized(req.path(), err.message));
        }
    }
}
export default RootCtrl;
