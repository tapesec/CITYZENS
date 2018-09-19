import * as AlgoliaSearch from 'algoliasearch';
import * as restify from 'restify';
import cityRepositoryInMemory from '../../infrastructure/CityRepositoryInMemory';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import HotspotRepositoryPostgreSQL from '../../infrastructure/HotspotRepositoryPostgreSQL';
import MessageFactory from '../../application/domain/hotspot/MessageFactory';
import MessageRepositoryPostgreSql from '../../infrastructure/MessageRepositoryPostgreSQL';
import { default as OrmHotspot } from '../../infrastructure/ormHotspot';
import OrmMessage from '../../infrastructure/ormMessage';
import AuthCtrl from '../controllers/AuthCtrl';
import CityCtrl from '../controllers/CityCtrl';
import CityzenCtrl from '../controllers/CityzenCtrl';
import HotspotCtrl from '../controllers/HotspotCtrl';
import MessageCtrl from '../controllers/MessageCtrl';
import ProfileCtrl from '../controllers/ProfileCtrl';
import auth0Sdk from '../libs/Auth0';
import Auth0Service from '../services/auth/Auth0Service';
import FilestackService from '../services/filestack/FilestackService';
import pg from '../../infrastructure/libs/postgreSQL/postgreSQL';
import SlideshowService from '../services/widgets/SlideshowService';
import OrmCityzen from './../../infrastructure/ormCityzen';
import config from './../config';
import AlgoliaApi from './../libs/AlgoliaAPI';
import Algolia from './../services/algolia/Algolia';
import ErrorHandler from './../services/errors/ResponseError';
import AuthRouter from './AuthRouter';
import CityRouter from './CityRouter';
import CityzenRouter from './CityzenRouter';
import HotspotRouter from './HotspotRouter';
import MessageRouter from './MessageRouter';
import ProfileRouter from './ProfileRouter';
import SwaggerRouter from './SwaggerRouter';

import { createWebhook } from '../libs/SlackWebhook';
import { createlogger } from '../libs/MCDVLogger';
import HotspotsParZone, { IHotspotsParZone } from '../../application/usecases/HotspotsParZone';
import Carte from '../../application/domain/hotspot/Carte';
import HotspotsParCodeInsee, {
    IHotspotsParCodeInsee,
} from '../../application/usecases/HotspotsParCodeInsee';
import HotspotParSlugOuId, {
    IHotspotParSlugOuId,
} from '../../application/usecases/HotspotParSlugOuId';
import NouveauHotspot, { INouveauHotspot } from '../../application/usecases/NouveauHotspot';
import CompteUneVue, { ComptabiliseUneVue } from '../../application/usecases/ComptabiliseUneVue';
import Existence, { ConfirmeExistence } from '../../application/usecases/ConfirmeExistence';

const request = require('request');

const algoliaSearch = AlgoliaSearch(
    config.algolia.algoliaAppId,
    config.algolia.algoliaApiKey,
    config.algolia.opts,
);
const algoliaApi = new AlgoliaApi(algoliaSearch);
const algolia = new Algolia(algoliaApi);

const slackWebhook = createWebhook({ url: config.slack.slackWebhookErrorUrl });
const MCDVLogger = createlogger({ env: config.server.env });

const errorHandler = new ErrorHandler();

const auth0Service = new Auth0Service(auth0Sdk, request, errorHandler);

const ormHotspot = new OrmHotspot(pg);
const ormCityzen = new OrmCityzen(pg);
const ormMessage = new OrmMessage(pg);

const messageFactory = new MessageFactory();

const cityzenRepositoryPostgreSQL = new CityzenRepositoryPostgreSQL(ormCityzen);
const hotspotRepo: Carte = new HotspotRepositoryPostgreSQL(ormHotspot, algolia);
const messageRepositoryInMemory = new MessageRepositoryPostgreSql(ormMessage, messageFactory);

const filestackService = new FilestackService(request);
const slideshowService = new SlideshowService(filestackService);

export const init = (server: restify.Server) => {
    const routers = [];
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(auth0Service, cityzenRepositoryPostgreSQL)));
    routers.push(
        new ProfileRouter(
            new ProfileCtrl(auth0Service, cityzenRepositoryPostgreSQL, auth0Sdk, hotspotRepo),
        ),
    );
    routers.push(
        new CityRouter(
            new CityCtrl(auth0Service, cityzenRepositoryPostgreSQL, cityRepositoryInMemory),
        ),
    );

    // use cases
    const hotspotsParZone: IHotspotsParZone = new HotspotsParZone(hotspotRepo);
    const hotspotsParCodeInsee: IHotspotsParCodeInsee = new HotspotsParCodeInsee(hotspotRepo);
    const hotpotsParSlugOuId: IHotspotParSlugOuId = new HotspotParSlugOuId(hotspotRepo);
    const nouveauHotspot: INouveauHotspot = new NouveauHotspot(hotspotRepo);
    const nouvelleVue: ComptabiliseUneVue = new CompteUneVue(hotspotRepo);
    const confirmeExistence: ConfirmeExistence = new Existence(hotspotRepo);

    routers.push(
        new HotspotRouter(
            new HotspotCtrl(
                auth0Service,
                cityzenRepositoryPostgreSQL,
                hotspotRepo,
                algolia,
                slideshowService,
                hotspotsParZone,
                hotspotsParCodeInsee,
                hotpotsParSlugOuId,
                nouveauHotspot,
                nouvelleVue,
                confirmeExistence,
            ),
        ),
    );
    routers.push(
        new MessageRouter(
            new MessageCtrl(
                auth0Service,
                cityzenRepositoryPostgreSQL,
                hotspotRepo,
                messageRepositoryInMemory,
                messageFactory,
            ),
        ),
    );
    routers.push(new CityzenRouter(new CityzenCtrl(auth0Service, cityzenRepositoryPostgreSQL)));

    routers.forEach(r => r.bind(server));
};
