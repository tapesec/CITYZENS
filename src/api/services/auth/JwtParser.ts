import config from './../../config/';

class JwtParser​​ {

    private jwt : any;

    constructor(jwt : any) {
        this.jwt = jwt;
    }

    public verify = (token : string) => {
        return new Promise((resolve, reject) => {
            this.jwt.verify(
                token,
                config.auth.auth0ClientSecret,
                {
                    algorithms: ['HS256'],
                    audience: config.auth.auth0Audience,
                },
                (err : any, decoded :any) => {
                    if (err) reject(err);
                    else resolve(decoded);
                },
            );
        });
    }
}
export default JwtParser;
