import DecodedJwtPayload from '../services/auth/DecodedJwtPayload';
import Cityzen from './../../domain/cityzens/model/Cityzen';
import JwtParser from './../services/auth/JwtParser';
import * as r from 'restify';
import config from './../config/index';
const restifyErrors = require('restify-errors');
import * as ajv from 'ajv';

class RootCtrl {

    protected _decodedJwtPayload : DecodedJwtPayload;
    protected jwtParser : JwtParser;
    protected schemaValidator : ajv.Ajv = new ajv();

    constructor(jwtParser? : JwtParser) {
        if (jwtParser) this.jwtParser = jwtParser;
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

    get decodedJwtPayload() : DecodedJwtPayload {
        return this._decodedJwtPayload;
    }
}
export default RootCtrl;
