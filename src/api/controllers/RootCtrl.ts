import AuthorizedCityzen from '../services/auth/AuthorizedCityzen';
import Cityzen from './../../domain/cityzens/model/Cityzen';
import JwtParser from './../services/auth/JwtParser';
import * as r from 'restify';
import config from './../config/index';
const restifyErrors = require('restify-errors');

class RootCtrl {

    protected _authorizedCityzen : Cityzen;
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
            this._authorizedCityzen = new AuthorizedCityzen(decodedToken).load();
            next(); 
        } catch (err) {
            next(new restifyErrors.UnauthorizedError(err.message));
        }
    }

    get authorizedCityzen() : Cityzen {
        return this._authorizedCityzen;
    }
}
export default RootCtrl;
