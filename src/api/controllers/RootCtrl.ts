import * as ajv from 'ajv';
import * as r from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import Cityzen from '../../application/domain/cityzen/Cityzen';
import CityzenId from '../../application/domain/cityzen/CityzenId';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
import ResponseError from '../services/errors/ResponseError';
import { MCDVLogger, getlogger, MCDVLoggerEvent } from '../libs/MCDVLogger';

class RootCtrl {
    protected cityzenRepository: CityzenRepositoryPostgreSQL;
    protected schemaValidator: ajv.Ajv;
    protected responseError: ResponseError;
    protected userInfo: UserInfoAuth0;
    protected cityzenIfAuthenticated: Cityzen;
    protected auth0Service: Auth0Service;
    protected logger: MCDVLogger;

    constructor(auth0Info: Auth0Service, repository: CityzenRepositoryPostgreSQL) {
        this.cityzenRepository = repository;
        this.auth0Service = auth0Info;
        this.responseError = new ResponseError();
        this.schemaValidator = new ajv({ allErrors: true });
        this.logger = getlogger();
    }

    public loadAuthenticatedUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        this.userInfo = undefined;
        this.cityzenIfAuthenticated = undefined;

        const headerAuthorization = req.header('Authorization');

        if (!headerAuthorization) {
            return next(this.responseError.logAndCreateUnautorized(req, 'Token must be provided'));
        }

        const access_token = headerAuthorization.slice(7);
        try {
            this.userInfo = await this.auth0Service.getUserInfo(access_token);
            this.cityzenIfAuthenticated = await this.cityzenRepository.findById(
                new CityzenId(this.userInfo.sub),
            );
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'debugging loading authenticated user', {
                sub: this.userInfo.sub,
                cityzen: this.cityzenIfAuthenticated,
            });
            return next();
        } catch (err) {
            return next(this.responseError.logAndCreateUnautorized(req, err.message));
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
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'debugging loading authenticated user', {
                sub: this.userInfo.sub,
                cityzen: this.cityzenIfAuthenticated,
            });
        } catch (err) {
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'error while loading authenticated user', {
                sub: this.userInfo.sub,
                cityzen: this.cityzenIfAuthenticated,
            });
        }

        return next();
    };
}
export default RootCtrl;
