import config from '../config';
import { OK } from 'http-status-codes';
const request = require('request');


interface ApiManagementCredentials {
    url : string;
    token : string;
    clientId : string;
    clientSecret : string;
}

class Auth0ManagementclientApi {

    protected opts : ApiManagementCredentials;
    protected request : any;
    protected apiUrlSuffix : string; 

    constructor(options : ApiManagementCredentials, request : any) {
        this.opts = options;
        this.request = request;
        this.apiUrlSuffix = config.auth.auth0ManagementUrlSuffix;
    }

    public updateUserMetadataById = async (userId : string, data : any) => {
        const options = {
            method: 'PATCH',
            url: this.opts.url + this.apiUrlSuffix + `/users/${userId}`,
            headers: { 
                'content-type': 'application/json',
                // tslint:disable-next-line:object-literal-key-quotes
                'Authorization': `Bearer ${this.opts.token}`, 
            },
            body: { user_metadata: data },
            json: true,
        };
        return this.apiCall(options);
    }

    public getAuthenticationRefreshToken = async (refreshToken : string) : Promise<any> => {
        const options = {
            method: 'POST',
            url: this.opts.url + '/oauth/token',
            headers: { 
                'content-type': 'application/json',
            },
            body: {
                grant_type : 'refresh_token',
                client_id : this.opts.clientId,
                client_secret : this.opts.clientSecret,
                refresh_token : refreshToken,
            },
            json: true,
        };
        return this.apiCall(options);
    }

    private apiCall = (options : any) : any => {
        return new Promise((resolve, reject) => {
            this.request(options, (error : any, response : any, body : any) => {
                if (error || response.statusCode !== OK) {
                    reject(new Error(error));
                } else {
                    resolve(body);
                }
            });
        });
    }
}

const auth0ManagementclientApi = { 
    url: config.auth.auth0url, 
    token: config.auth.auth0ManagementApiToken,
    clientId : config.auth.auth0ClientId,
    clientSecret : config.auth.auth0ClientSecret,
};

const auth0 = new Auth0ManagementclientApi(auth0ManagementclientApi, request);
export { Auth0ManagementclientApi };
export default auth0;
