import * as rest from 'restify';
import RootCtrl from './RootCtrl';
import CityzenAConnecter from '../../application/usecases/CityzenAConnecter';
import UseCaseStatus from '../../application/usecases/UseCaseStatus';
import jwt from 'jsonwebtoken';
class AuthCtrl extends RootCtrl {
    constructor(protected cityzenAConnecter: CityzenAConnecter) {
        super();
    }

    public login = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const useCaseResult = await this.cityzenAConnecter.run(
                req.body.email,
                req.body.password,
            );
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateInvalidCredentials(
                        req,
                        'Email or password incorrect',
                    ),
                );
            }
            const accessToken = jwt.sign({ userId: useCaseResult.cityzen.id }, 'aRandomSecret', {
                expiresIn: '1h',
            });
            // req.body.username;
            // req.ody.password;
            /*
            let body: any;
            try {
                body = await this.auth0Service.login(req.query.username, req.query.password);
            } catch (error) {
                return next(this.responseError.logAndCreateInvalidCredentials(req, error.message));
            }
            if (body.error) {
                return next(
                    this.responseError.logAndCreateInvalidCredentials(req, body.error_description),
                );
            }
            res.json(body); */
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}
export default AuthCtrl;
