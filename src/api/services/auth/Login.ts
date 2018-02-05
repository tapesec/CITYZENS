import ErrorHandler from '../errors/ErrorHandler';
import UserInfoAuth0 from './UserInfoAuth0';
import AuthentificationError from './../errors/AuthentificationError';

export interface LoginOptions {
    url : string;
    clientId : string;
    clientSecret : string;
}

class Login {

    private errorHandler: ErrorHandler;
    // tslint:disable-next-line:no-unused-variable
    private username : string;
    // tslint:disable-next-line:no-unused-variable
    private password : string;
    private opts : any;
    private request : any;

    constructor(options : LoginOptions, request : any, errorHandler: ErrorHandler) {
        this.opts = options;
        this.request = request;
        this.errorHandler = errorHandler;
    }

    auth0UserInfo(accessToken: string) {
        return new Promise<UserInfoAuth0>((resolve, reject) => {
            const data = {
                method: 'GET',
                url: this.opts.url + '/userinfo',
                headers: { Authorization: `Bearer ${accessToken}` },
            };

            const callback = (err: any, res: any, body: any) => {
                if (res.statusCode !== 200) {
                    reject({
                        err,
                        body,
                    });
                } else {
                    resolve(new UserInfoAuth0(body));
                }
            };

            this.request(data, callback);
        }).catch((r) => {
            throw new AuthentificationError(r.err, r.body, accessToken);
        });
    }

    try(username : string, password : string) {
        return new Promise((resolve, reject) => {
            const data = {
                method: 'POST',
                url: this.opts.url + '/oauth/token',
                headers: { 'content-type': 'application/json' },
                body:
                {
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

            const callback = (error : any, response : any, body : any) => {
                if (error) {
                    reject(this.errorHandler.logAndCreateInternal('GET auth', error));
                } else {
                    resolve(body);
                }
            };

            this.request(data, callback);
        });
    }
}
export default Login;
