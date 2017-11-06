import config from './../../config/';

class JwtParser​​ {

    private jwt : any;
    private secret : string;

    constructor(jwt : any, secret : string) {
        this.jwt = jwt;
        this.secret = secret;
    }

    public verify = (token : string) => {
        return new Promise((resolve, reject) => {
            this.jwt.verify(
                token,
                this.secret,
                {
                    algorithms: ['HS256'],
                },
                (err : any, decoded : any) => {
                    if (err) reject(err);
                    else resolve(decoded);
                },
            );
        });
    }
}
export default JwtParser;
