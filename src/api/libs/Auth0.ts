import config from '../config';
import { OK } from 'http-status-codes';
import retryPromise from '../../infrastructure/libs/retryPromise';
import CityzenId from '../../application/domain/cityzen/CityzenId';
const request = require('request');

export interface ApiManagementCredentials {
    url: string;
    token: string;
    clientId: string;
    clientSecret: string;
}

class Auth0 {
    protected opts: ApiManagementCredentials;
    protected request: any;
    protected apiUrlSuffix: string;
    protected apiManagementUrlSuffix: string = '/api/v2';

    constructor(options: ApiManagementCredentials, request: any) {
        this.opts = options;
        this.request = request;
    }

    public getUserInfo = async (accessToken: string) => {
        const options = {
            method: 'GET',
            url: this.opts.url + '/userinfo',
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        return this.retryApiCall(options);
    };

    public login = async (username: string, password: string) => {
        const options = {
            method: 'POST',
            url: this.opts.url + '/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: {
                username,
                password,
                grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
                // offline_access enable refresh_token in the response
                scope: 'openid offline_access',
                client_id: this.opts.clientId,
                client_secret: this.opts.clientSecret,
                realm: 'Cityzens-self-stored',
            },
            json: true,
        };

        return this.retryApiCall(options);
    };

    public updateUserMetadataById = async (userId: CityzenId, data: any) => {
        const options = {
            method: 'PATCH',
            url: this.opts.url + this.apiManagementUrlSuffix + `/users/${userId.id}`,
            headers: {
                'content-type': 'application/json',
                // tslint:disable-next-line:object-literal-key-quotes
                Authorization: `Bearer ${this.opts.token}`,
            },
            body: { user_metadata: data },
            json: true,
        };
        return this.retryApiCall(options);
    };

    public getAuthenticationRefreshToken = (refreshToken: string): Promise<any> => {
        const options = {
            method: 'POST',
            url: this.opts.url + '/oauth/token',
            headers: {
                'content-type': 'application/json',
            },
            body: {
                grant_type: 'refresh_token',
                client_id: this.opts.clientId,
                client_secret: this.opts.clientSecret,
                refresh_token: refreshToken,
            },
            json: true,
        };
        return this.retryApiCall(options);
    };

    private retryApiCall = (opts: any): Promise<any> => {
        const retryOpts = {
            retries: 2,
        };
        return retryPromise(() => this.apiCall(opts), retryOpts);
    };

    private apiCall = (options: any): any => {
        return new Promise((resolve, reject) => {
            this.request(options, (error: any, response: any, body: any) => {
                if (error) {
                    reject(new Error(error));
                } else if (response.statusCode !== OK) {
                    reject(body);
                } else {
                    resolve(body);
                }
            });
        });
    };
}

const auth0ManagementclientApi = {
    url: config.auth.auth0url,
    token: config.auth.auth0ManagementApiToken,
    clientId: config.auth.auth0ClientId,
    clientSecret: config.auth.auth0ClientSecret,
};

const auth0 = new Auth0(auth0ManagementclientApi, request);
export { Auth0 };
export default auth0;
