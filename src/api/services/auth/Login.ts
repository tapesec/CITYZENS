import ErrorHandler from 'src/api/services/errors/ErrorHandler';

export interface LoginOptions {
    url : string;
    clientId : string;
    clientSecret : string;
}

class Login {

    private errorHandler: ErrorHandler;
    private username : string;
    private password : string;
    private opts : any;
    private request : any;

    constructor(options : LoginOptions, request : any, errorHandler: ErrorHandler) {
        this.opts = options;
        this.request = request;
        this.errorHandler = errorHandler;
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
