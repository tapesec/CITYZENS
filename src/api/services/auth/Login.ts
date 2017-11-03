interface LoginOptions {
    url : string;
    audience : string;
    clientId : string;
    clientSecret : string;
}

class Login {

    private username : string;
    private password : string;
    private opts : any;
    private request : any;

    constructor(options : LoginOptions, request : any) {
        this.opts = options;
        this.request = request;
    }

    try(username : string, password : string) {
        return new Promise((resolve, reject) => {
            this.request(
                { method: 'POST',
                    url: this.opts.url,
                    headers: { 'content-type': 'application/json' },
                    body:
                    {
                        username,
                        password,
                        grant_type: 'password',
                        audience: this.opts.audience,
                        // scope: 'read:sample',
                        client_id: this.opts.clientId,
                        client_secret: this.opts.clientSecret,
                    },
                    json: true,
                },
                (error : any, response : any, body : any) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(body);
                    }
                });
        });

    }
}
export default Login;
