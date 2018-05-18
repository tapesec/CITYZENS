import * as AlgoliaSearch from 'algoliasearch';
import * as restify from 'restify';
import cityRepositoryInMemory from '../../infrastructure/CityRepositoryInMemory';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import MessageFactory from '../../infrastructure/MessageFactory';
import messageRepositoryInMemory from '../../infrastructure/MessageRepositoryInMemory';
import AuthCtrl from '../controllers/AuthCtrl';
import CityCtrl from '../controllers/CityCtrl';
import HotspotCtrl from '../controllers/HotspotCtrl';
import MessageCtrl from '../controllers/MessageCtrl';
import ProfileCtrl from '../controllers/ProfileCtrl';
import auth0Sdk from '../libs/Auth0';
import Auth0Service from '../services/auth/Auth0Service';
import FilestackService from '../services/filestack/FilestackService';
import PostgreSQL from '../services/postgreSQL/postgreSQL';
import SlideshowService from '../services/widgets/SlideshowService';
import orm from './../../infrastructure/orm';
import OrmCityzen from './../../infrastructure/ormCityzen';
import config from './../config';
import AlgoliaApi from './../libs/AlgoliaAPI';
import SlackWebhook from './../libs/SlackWebhook';
import Algolia from './../services/algolia/Algolia';
import ErrorHandler from './../services/errors/ErrorHandler';
import AuthRouter from './AuthRouter';
import CityRouter from './CityRouter';
import HotspotRouter from './HotspotRouter';
import MessageRouter from './MessageRouter';
import ProfileRouter from './ProfileRouter';
import SwaggerRouter from './SwaggerRouter';
import CheckAndCreateTable from '../services/postgreSQL/checkAndCreateTables';

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

const postgreSql = new PostgreSQL(config.postgreSQL);

const ormCityzen = new OrmCityzen(postgreSql);

const cityzenRepositoryPostgreSQL = new CityzenRepositoryPostgreSQL(ormCityzen);
const hotspotRepositoryInMemory = new HotspotRepositoryInMemory(orm, ormCityzen);

const filestackService = new FilestackService(request);
const slideshowService = new SlideshowService(filestackService);

// const jwtParser = new JwtParser(jwt, config.auth.auth0ClientSecret);

export const initDB = async (server: restify.Server) => {
    console.log('Trying to connect');
    await CheckAndCreateTable.cityzens(postgreSql);
};

export const init = (server: restify.Server) => {
    const routers = [];
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(errorHandler, auth0Service)));
    routers.push(
        new ProfileRouter(
            new ProfileCtrl(
                errorHandler,
                auth0Service,
                cityzenRepositoryPostgreSQL,
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
                slideshowService,
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
