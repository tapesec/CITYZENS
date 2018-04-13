import ErrorHandler from '../errors/ErrorHandler';
import UserInfoAuth0 from './UserInfoAuth0';
import * as now from './../time/now';

export interface LoginOptions {
    url: string;
    clientId: string;
    clientSecret: string;
}

class UserInfoCache {
    public static VALID_TIME = 10 * 60;

    constructor(public time: number, public userInfo: UserInfoAuth0) {}
}

class Login {
    private errorHandler: ErrorHandler;
    // tslint:disable-next-line:no-unused-variable
    private username: string;
    // tslint:disable-next-line:no-unused-variable
    private password: string;
    private opts: any;
    private request: any;

    private userInfoCache: Map<string, UserInfoCache>;

    constructor(options: LoginOptions, request: any, errorHandler: ErrorHandler) {
        this.opts = options;
        this.request = request;
        this.errorHandler = errorHandler;
        this.userInfoCache = new Map();
    }

    auth0UserInfo(accessToken: string) {
        if (this.userInfoCache.has(accessToken)) {
            const cache = this.userInfoCache.get(accessToken);

            if (now.seconds() - cache.time < UserInfoCache.VALID_TIME) {
                return Promise.resolve<UserInfoAuth0>(cache.userInfo);
            }

            this.userInfoCache.delete(accessToken);
        }

        return new Promise<UserInfoAuth0>((resolve, reject) => {
            const data = {
                method: 'GET',
                url: this.opts.url + '/userinfo',
                headers: { Authorization: `Bearer ${accessToken}` },
            };

            const callback = (err: any, res: any, body: any) => {
                if (err) return reject({ err, body });
                if (res.statusCode !== 200) {
                    reject({
                        err,
                        body,
                    });
                } else {
                    const userInfoAuth0 = new UserInfoAuth0(body, accessToken);
                    this.userInfoCache.set(
                        accessToken,
                        new UserInfoCache(now.seconds(), userInfoAuth0),
                    );

                    resolve(userInfoAuth0);
                }
            };

            this.request(data, callback);
        }).catch(r => {
            throw new Error(`Err: ${r.err},\n body: ${r.body}, \n ${accessToken}`);
        });
    }

    try(username: string, password: string) {
        return new Promise((resolve, reject) => {
            const data = {
                method: 'POST',
                url: this.opts.url + '/oauth/token',
                headers: { 'content-type': 'application/json' },
                body: {
                    username,
                    password,
                    grant_type: 'password',
                    // offline_access enable refresh_token in the response
                    scope: 'openid offline_access',
                    client_id: this.opts.clientId,
                    client_secret: this.opts.clientSecret,
                    connection: 'Cityzens',
                },
                json: true,
            };

            const callback = (error: any, response: any, body: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            };

            this.request(data, callback);
        });
    }
}
export default Login;
