import MessageFactory from '../../infrastructure/MessageFactory';
import messageRepositoryInMemory from '../../infrastructure/MessageRepositoryInMemory';
import MessageCtrl from '../controllers/MessageCtrl';
import MessageRouter from './MessageRouter';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import ProfileRouter from './ProfileRouter';
import ProfileCtrl from '../controllers/ProfileCtrl';
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
import Auth0Service from '../services/auth/Auth0Service';
import CityzenAuth0Repository from '../../infrastructure/CityzenAuth0Repository';

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

const errorHandler = new ErrorHandler(
    new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request),
    httpResponseDataLogger,
    restifyErrors,
);

const auth0Service = new Auth0Service(auth0Sdk, request, errorHandler);

const cityzenAuth0Repository = new CityzenAuth0Repository(auth0Service);
const hotspotRepositoryInMemory = new HotspotRepositoryInMemory(orm);

// const jwtParser = new JwtParser(jwt, config.auth.auth0ClientSecret);

export const init = (server: restify.Server) => {
    const routers = [];
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(errorHandler, auth0Service)));
    routers.push(
        new ProfileRouter(
            new ProfileCtrl(
                errorHandler,
                auth0Service,
                cityzenAuth0Repository,
                auth0Sdk,
                hotspotRepositoryInMemory,
            ),
        ),
    );
    routers.push(new CityRouter(new CityCtrl(errorHandler, auth0Service, cityRepositoryInMemory)));
    routers.push(
        new HotspotRouter(
            new HotspotCtrl(
                errorHandler,
                auth0Service,
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
                auth0Service,
                hotspotRepositoryInMemory,
                messageRepositoryInMemory,
                new MessageFactory(),
            ),
        ),
    );

    routers.forEach(r => r.bind(server));
};
