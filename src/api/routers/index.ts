import MessageFactory from '../../infrastructure/MessageFactory';
import messageRepositoryInMemory from '../../infrastructure/MessageRepositoryInMemory';
import MessageCtrl from '../controllers/MessageCtrl';
import MessageRouter from './MessageRouter';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import ProfileRouter from './ProfileRouter';
import ProfileCtrl from '../controllers/ProfileCtrl';
import cityzenAuth0Repository from '../../infrastructure/CityzenAuth0Repository';
import cityRepositoryInMemory from '../../infrastructure/CityRepositoryInMemory';
import CityCtrl from '../controllers/CityCtrl';
import CityRouter from './CityRouter';
import hotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import AuthRouter from './AuthRouter';
import AuthCtrl from '../controllers/AuthCtrl';
import * as restify from 'restify';
import HotspotRouter from './HotspotRouter';
import SwaggerRouter from './SwaggerRouter';
import HotspotCtrl from '../controllers/HotspotCtrl';
import Login from './../services/auth/Login';
import JwtParser from './../services/auth/JwtParser';
import * as request from 'request';
import config from './../config/';
import auth0Sdk from '../libs/Auth0';

const jwt = require('jsonwebtoken');

const loginService = new Login(
    {
        url: config.auth.auth0url,
        clientId: config.auth.auth0ClientId,
        clientSecret: config.auth.auth0ClientSecret,
    },
    request,
);

const jwtParser = new JwtParser(jwt, config.auth.auth0ClientSecret);


export const init = (server : restify.Server) => {
    const routers = [];
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(loginService)));
    routers.push(new ProfileRouter(
        new ProfileCtrl(jwtParser, cityzenAuth0Repository, auth0Sdk, hotspotRepositoryInMemory)));
    routers.push(new CityRouter(new CityCtrl(jwtParser, cityRepositoryInMemory)));
    routers.push(new HotspotRouter(
        new HotspotCtrl(jwtParser, hotspotRepositoryInMemory)));
    routers.push(new MessageRouter(
        new MessageCtrl(
            jwtParser, hotspotRepositoryInMemory, messageRepositoryInMemory, new MessageFactory(),
        ),
    ));

    routers.forEach(r => r.bind(server));
};
