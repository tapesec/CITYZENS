import * as r from 'restify';
import * as ajv from 'ajv';
import ErrorHandler from '../services/errors/ErrorHandler';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
import Cityzen from '../../domain/cityzens/model/Cityzen';
import cityzenFromAuth0 from '../services/cityzen/cityzenFromAuth0';
import Auth0Info from 'src/api/services/auth/Auth0Info';

class RootCtrl {
    protected schemaValidator: ajv.Ajv = new ajv();
    protected errorHandler: ErrorHandler;
    protected userInfo: UserInfoAuth0;
    protected cityzenIfAuthenticated: Cityzen;
    protected auth0Info: Auth0Info;

    constructor(errorHandler: ErrorHandler, auth0Info: Auth0Info) {
        this.auth0Info = auth0Info;
        this.errorHandler = errorHandler;
    }

    public loadAuthenticatedUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        this.userInfo = undefined;
        this.cityzenIfAuthenticated = undefined;

        if (!req.header('Authorization')) {
            return next(
                this.errorHandler.logAndCreateUnautorized(req.path(), 'Token must be provided'),
            );
        }

        const access_token = req.header('Authorization').slice(7);
        try {
            this.userInfo = await this.auth0Info.getUserInfo(access_token);
            this.cityzenIfAuthenticated = cityzenFromAuth0(this.userInfo);
            return next();
        } catch (err) {
            return next(this.errorHandler.logAndCreateUnautorized(req.path(), err.message));
        }
    };

    public optInAuthenticateUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        this.userInfo = undefined;
        this.cityzenIfAuthenticated = undefined;

        if (!req.header('Authorization')) return next();

        const access_token = req.header('Authorization').slice(7);
        if (access_token === '') return next();
        try {
            this.userInfo = await this.auth0Info.getUserInfo(access_token);
            this.cityzenIfAuthenticated = cityzenFromAuth0(this.userInfo);
        } catch (err) {}

        return next();
    };
}
export default RootCtrl;
