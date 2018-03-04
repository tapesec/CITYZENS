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
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import AuthRouter from './AuthRouter';
import AuthCtrl from '../controllers/AuthCtrl';
import * as restify from 'restify';
import HotspotRouter from './HotspotRouter';
import SwaggerRouter from './SwaggerRouter';
import HotspotCtrl from '../controllers/HotspotCtrl';
import Login from './../services/auth/Login';
import config from './../config';
import auth0Sdk from '../libs/Auth0';
import ErrorHandler from './../services/errors/ErrorHandler';
import SlackWebhook from './../libs/SlackWebhook';
import orm from './../../infrastructure/orm';
import AlgoliaApi from './../libs/AlgoliaAPI';
import Algolia from './../services/algolia/Algolia';
import * as AlgoliaSearch from 'algoliasearch';

// const jwt = require('jsonwebtoken');
const restifyErrors = require('restify-errors');
const logs = require('./../../logs');
const httpResponseDataLogger = logs.get('http-response-data');
const request = require('request');

const algoliaSearch = AlgoliaSearch(
    config.algolia.algoliaAppId,
    config.algolia.algoliaApiKey,
    config.algolia.opts,
);
const algoliaApi = new AlgoliaApi(algoliaSearch);
const algolia = new Algolia(algoliaApi);

const hotspotRepositoryInMemory = new HotspotRepositoryInMemory(orm);

// const jwtParser = new JwtParser(jwt, config.auth.auth0ClientSecret);

const errorHandler = new ErrorHandler(
    new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request),
    httpResponseDataLogger,
    restifyErrors,
);
const loginService = new Login(
    {
        url: config.auth.auth0url,
        clientId: config.auth.auth0ClientId,
        clientSecret: config.auth.auth0ClientSecret,
    },
    request,
    errorHandler,
);

export const init = (server: restify.Server) => {
    const routers = [];
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(errorHandler, loginService)));
    routers.push(
        new ProfileRouter(
            new ProfileCtrl(
                errorHandler,
                loginService,
                cityzenAuth0Repository,
                auth0Sdk,
                hotspotRepositoryInMemory,
            ),
        ),
    );
    routers.push(new CityRouter(new CityCtrl(errorHandler, loginService, cityRepositoryInMemory)));
    routers.push(
        new HotspotRouter(
            new HotspotCtrl(
                errorHandler,
                loginService,
                hotspotRepositoryInMemory,
                new HotspotFactory(),
                algolia,
            ),
        ),
    );
    routers.push(
        new MessageRouter(
            new MessageCtrl(
                errorHandler,
                loginService,
                hotspotRepositoryInMemory,
                messageRepositoryInMemory,
                new MessageFactory(),
            ),
        ),
    );

    routers.forEach(r => r.bind(server));
};
