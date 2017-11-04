import AuthRouter from './AuthRouter';
import AuthCtrl from '../controllers/AuthCtrl';
import * as restify from 'restify';
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:import-name
import hotspotRepositoryInMemory from '../../domain/cityLife/infrastructure/HotspotRepositoryInMemory';
import HotspotRouter from './HotspotRouter';
import SwaggerRouter from './SwaggerRouter';
import HotspotCtrl from '../controllers/HotspotCtrl';
import Login from './../services/auth/Login';
import JwtParser from './../services/auth/JwtParser';
import * as request from 'request';
import config from './../config/';

const loginService = new Login(
    {
        url: config.auth.auth0url,
        clientId: config.auth.auth0ClientId,
        clientSecret: config.auth.auth0ClientSecret,
    },
    request,
);


export const init = (server : restify.Server) => {
    const routers = [];
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(loginService)));
    routers.push(new HotspotRouter(new HotspotCtrl(hotspotRepositoryInMemory)));
    routers.forEach(r => r.bind(server));
};
