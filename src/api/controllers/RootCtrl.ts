import * as ajv from 'ajv';
import * as r from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import Cityzen from '../../domain/cityzens/model/Cityzen';
import CityzenId from '../../domain/cityzens/model/CityzenId';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
import ErrorHandler from '../services/errors/ErrorHandler';
const logs = require('./../../logs');
const httpLogger = logs.get('log-debug');

class RootCtrl {
    protected cityzenRepository: CityzenRepositoryPostgreSQL;
    protected schemaValidator: ajv.Ajv;
    protected errorHandler: ErrorHandler;
    protected userInfo: UserInfoAuth0;
    protected cityzenIfAuthenticated: Cityzen;
    protected auth0Service: Auth0Service;

    constructor(
        errorHandler: ErrorHandler,
        auth0Info: Auth0Service,
        ormCityzen: CityzenRepositoryPostgreSQL,
    ) {
        this.cityzenRepository = ormCityzen;
        this.auth0Service = auth0Info;
        this.errorHandler = errorHandler;
        this.schemaValidator = new ajv({ allErrors: true });
    }

    public loadAuthenticatedUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        this.userInfo = undefined;
        this.cityzenIfAuthenticated = undefined;

        const headerAuthorization = req.header('Authorization');

        if (!headerAuthorization) {
            return next(
                this.errorHandler.logAndCreateUnautorized(req.path(), 'Token must be provided'),
            );
        }

        const access_token = headerAuthorization.slice(7);
        try {
            this.userInfo = await this.auth0Service.getUserInfo(access_token);
            httpLogger.info(JSON.stringify(this.userInfo));
            this.cityzenIfAuthenticated = await this.cityzenRepository.findById(
                new CityzenId(this.userInfo.sub),
            );
            return next();
        } catch (err) {
            return next(this.errorHandler.logAndCreateUnautorized(req.path(), err.message));
        }
    };

    public optInAuthenticateUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        this.userInfo = undefined;
        this.cityzenIfAuthenticated = undefined;

        const headerAuthorization = req.header('Authorization');
        if (!headerAuthorization) return next();

        const access_token = headerAuthorization.slice(7);
        if (access_token === '') return next();
        try {
            this.userInfo = await this.auth0Service.getUserInfo(access_token);
            this.cityzenIfAuthenticated = await this.cityzenRepository.findById(
                new CityzenId(this.userInfo.sub),
            );
        } catch (err) {}

        return next();
    };
}
export default RootCtrl;
