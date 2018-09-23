import Cityzen from './src/application/domain/cityzen/Cityzen';
import * as restify from 'restify';

declare module 'restify' {
    interface Request {
        cityzenIfAuthenticated?: Cityzen;
    }
}
