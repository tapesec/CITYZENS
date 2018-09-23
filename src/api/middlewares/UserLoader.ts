import * as r from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import CityzenId from '../../application/domain/cityzen/CityzenId';
import ResponseError from '../services/errors/ResponseError';
import { MCDVLogger, getlogger, MCDVLoggerEvent } from '../libs/MCDVLogger';
import Cityzen from '../../application/domain/cityzen/Cityzen';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
import ICityzenRepository from '../../application/domain/cityzen/ICityzenRepository';

class UserLoader {
    protected responseError: ResponseError;
    protected logger: MCDVLogger;

    constructor(
        protected auth0Service: Auth0Service,
        protected cityzenRepository: ICityzenRepository,
    ) {
        this.responseError = new ResponseError();
        this.logger = getlogger();
    }

    public loadAuthenticatedUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        let userInfo: UserInfoAuth0;
        let cityzenIfAuthenticated: Cityzen;
        try {
            const headerAuthorization = req.header('Authorization');
            if (!headerAuthorization) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, 'Token must be provided'),
                );
            }
            const access_token = headerAuthorization.slice(7);
            userInfo = await this.auth0Service.getUserInfo(access_token);
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'userInfo', { userInfo });
            cityzenIfAuthenticated = await this.cityzenRepository.findById(
                new CityzenId(userInfo.sub),
            );
            req.cityzenIfAuthenticated = cityzenIfAuthenticated;
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'debugging loading authenticated user', {
                sub: userInfo.sub,
                cityzen: cityzenIfAuthenticated,
            });
            return next();
        } catch (err) {
            return next(this.responseError.logAndCreateUnautorized(req, err.message));
        }
    };

    public optInAuthenticateUser = async (req: r.Request, res: r.Response, next: r.Next) => {
        let userInfo: UserInfoAuth0;
        let cityzenIfAuthenticated: Cityzen;
        try {
            const headerAuthorization = req.header('Authorization');
            if (!headerAuthorization) return next();

            const access_token = headerAuthorization.slice(7);
            if (access_token === '') return next();
            userInfo = await this.auth0Service.getUserInfo(access_token);
            cityzenIfAuthenticated = await this.cityzenRepository.findById(
                new CityzenId(userInfo.sub),
            );
            req.cityzenIfAuthenticated = cityzenIfAuthenticated;
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'debugging loading authenticated user', {
                sub: userInfo.sub,
                cityzen: cityzenIfAuthenticated,
            });
        } catch (err) {
            this.logger.debug(MCDVLoggerEvent.DEBUG, 'error while loading authenticated user', {
                sub: userInfo ? userInfo.sub : 'unknown',
                cityzen: cityzenIfAuthenticated ? cityzenIfAuthenticated : 'unknown',
            });
        }
        return next();
    };
}
export default UserLoader;
