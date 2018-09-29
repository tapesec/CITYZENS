import CityzenId from '../../../application/domain/cityzen/CityzenId';
import { Auth0 } from '../../libs/Auth0';
import MemoryCache from '../../../infrastructure/libs/MemoryCache';
import ErrorHandler from '../errors/ResponseError';
import UserInfoAuth0 from './UserInfoAuth0';

class Auth0Service {
    private cache: MemoryCache<string>;

    constructor(
        protected auth0: Auth0,
        protected request: any,
        protected errorHandler: ErrorHandler,
    ) {
        this.cache = new MemoryCache<string>();
    }

    public async updateMetadata(id: CityzenId, accessToken: string, data: any) {
        return new Promise<any>(async (resolve, reject) => {
            this.auth0
                .updateUserMetadataById(id, data)
                .then(v => {
                    this.cache.invalidate(accessToken);
                    resolve(v);
                })
                .catch(err => reject(err));
        });
    }

    public async getUserInfo(accessToken: string) {
        if (this.cache.isValid(accessToken)) {
            return Promise.resolve<UserInfoAuth0>(this.cache.get(accessToken));
        }

        return new Promise<UserInfoAuth0>(async (resolve, reject) => {
            await this.auth0
                .getUserInfo(accessToken)
                .then(body => {
                    const userInfoAuth0 = new UserInfoAuth0(body, accessToken);
                    this.cache.set(accessToken, userInfoAuth0);

                    resolve(userInfoAuth0);
                })
                .catch(r => {
                    reject(r);
                });
        }).catch(r => {
            throw new Error(`Error (on ${accessToken}): ${r.err}\n `);
        });
    }

    public login(username: string, password: string) {
        return new Promise(async (resolve, reject) => {
            await this.auth0
                .login(username, password)
                .then(r => resolve(r))
                .catch(err => {
                    const error = new Error(err.error + ' \n' + err.error_description);
                    reject(error);
                });
        });
    }
}

export default Auth0Service;
