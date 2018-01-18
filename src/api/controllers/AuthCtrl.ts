import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import Login from './../services/auth/Login';
import ErrorHandler from 'src/api/services/errors/ErrorHandler';

class AuthCtrl extends RootCtrl {

    constructor(
        errorHandler: ErrorHandler,
        loginService : Login,
    ) {
        super(errorHandler, loginService);
    }

    public login = async (req : rest.Request, res : rest.Response, next : rest.Next) => {
        try {
            const body : any = await this.loginService.try(req.query.username, req.query.password);
            if (body.error) {
                return next(this.errorHandler.logAndCreateInvalidCredentials(
                    `DELETE ${req.path()}`, body.error_description,
                ));
            }
            res.json(body);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err.message),
            );
        }
    }
}
export default AuthCtrl;
