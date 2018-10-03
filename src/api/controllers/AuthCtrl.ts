import * as rest from 'restify';
import RootCtrl from './RootCtrl';
import CityzenAConnecter from '../../application/usecases/CityzenAConnecter';
import UseCaseStatus from '../../application/usecases/UseCaseStatus';
import { sign } from 'jsonwebtoken';
import { OK, CREATED } from 'http-status-codes';
import Inscription from '../../application/usecases/Inscription';
import { signinSchema, signupSchema } from '../requestValidation/auth';
class AuthCtrl extends RootCtrl {
    private static ALREADY_SIGNIN_MESSAGE = 'User already signed in';
    private static SIGNIN_BAD_FORMAT = 'Email and password must be provided';

    constructor(
        protected cityzenAConnecter: CityzenAConnecter,
        protected inscription: Inscription,
    ) {
        super();
    }

    public login = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(signinSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateInvalidCredentials(
                        req,
                        AuthCtrl.SIGNIN_BAD_FORMAT,
                    ),
                );
            }
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
            const accessToken = sign({ userId: useCaseResult.cityzen.id }, 'aRandomSecret', {
                expiresIn: '1h',
            });
            res.json(OK, { accessToken });
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    public signup = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(signupSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateInvalidCredentials(
                        req,
                        this.schemaValidator.errorsText(),
                    ),
                );
            }
            const useCaseResult = await this.inscription.run({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            });
            if (useCaseResult.status === UseCaseStatus.ALREADY_SIGN_UP) {
                return next(
                    this.responseError.logAndCreateBadRequest(req, AuthCtrl.ALREADY_SIGNIN_MESSAGE),
                );
            }
            const accessToken = sign({ userId: useCaseResult.newCityzen.id }, 'aRandomSecret', {
                expiresIn: '1h',
            });
            res.json(CREATED, { accessToken });
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };
}
export default AuthCtrl;
