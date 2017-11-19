import DecodedJwtPayload from '../services/auth/DecodedJwtPayload';
import Cityzen from './../../domain/cityzens/model/Cityzen';
import JwtParser from './../services/auth/JwtParser';
import * as r from 'restify';
import config from './../config/index';
const restifyErrors = require('restify-errors');

class RootCtrl {

    protected _decodedJwtPayload : DecodedJwtPayload;
    protected jwtParser : JwtParser;

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
            next(); 
        } catch (err) {
            next(new restifyErrors.UnauthorizedError(err.message));
        }
    }

    get decodeJwtPayload() : DecodedJwtPayload {
        return this._decodedJwtPayload;
    }
}
export default RootCtrl;
