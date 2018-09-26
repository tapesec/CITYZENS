import * as AlgoliaSearch from 'algoliasearch';
import * as restify from 'restify';
const request = require('request');

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
import ConfirmeExistence from '../../application/usecases/ConfirmeExistence';
import UserLoader from '../middlewares/UserLoader';
import ICityzenRepository from '../../application/domain/cityzen/ICityzenRepository';
import ModifierUnHotspot from '../../application/usecases/ModifierUnHotspot';
import SupprimerUnHotspot from '../../application/usecases/SupprimerUnHotspot';
import ActualiteHotspot from '../../application/usecases/ActualiteHotspot';
import ObtenirCommentaires from '../../application/usecases/ObtenirCommentaires';
import PublierUnMessage from '../../application/usecases/PublierUnMessage';
import RepondreAUnMessage from '../../application/usecases/RepondreAUnMessage';
import EditerUnMessage from '../../application/usecases/EditerUnMessage';

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
const filestackService = new FilestackService(request);
const slideshowService = new SlideshowService(filestackService);

const cityzenRepositoryPostgreSQL: ICityzenRepository = new CityzenRepositoryPostgreSQL(ormCityzen);
const hotspotRepo: Carte = new HotspotRepositoryPostgreSQL(ormHotspot, algolia, slideshowService);
const messageRepo = new MessageRepositoryPostgreSql(ormMessage, messageFactory);

export const init = (server: restify.Server) => {
    const routers = [];
    const userLoader = new UserLoader(auth0Service, cityzenRepositoryPostgreSQL);
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(auth0Service), userLoader));
    routers.push(new CityRouter(new CityCtrl(cityRepositoryInMemory)));

    // use cases
    const hotspotsParZone: IHotspotsParZone = new HotspotsParZone(hotspotRepo);
    const hotspotsParCodeInsee: IHotspotsParCodeInsee = new HotspotsParCodeInsee(hotspotRepo);
    const hotpotsParSlugOuId: IHotspotParSlugOuId = new HotspotParSlugOuId(hotspotRepo);
    const nouveauHotspot: INouveauHotspot = new NouveauHotspot(hotspotRepo);
    const nouvelleVue: ComptabiliseUneVue = new CompteUneVue(hotspotRepo);
    const confirmeExistence: ConfirmeExistence = new ConfirmeExistence(hotspotRepo);
    const modifierUnHotspot: ModifierUnHotspot = new ModifierUnHotspot(hotspotRepo);
    const supprimerUnHotspot: SupprimerUnHotspot = new SupprimerUnHotspot(hotspotRepo);

    routers.push(
        new HotspotRouter(
            new HotspotCtrl(
                hotspotRepo,
                algolia,
                hotspotsParZone,
                hotspotsParCodeInsee,
                hotpotsParSlugOuId,
                nouveauHotspot,
                nouvelleVue,
                confirmeExistence,
                modifierUnHotspot,
                supprimerUnHotspot,
            ),
            userLoader,
        ),
    );
    // use cases
    const actualiteHotspot = new ActualiteHotspot(hotspotRepo, messageRepo);
    const obtenirCommentaires = new ObtenirCommentaires(hotspotRepo, messageRepo);
    const publierUnMessage = new PublierUnMessage(hotspotRepo, messageRepo);
    const repondreAUnMessage = new RepondreAUnMessage(hotspotRepo, messageRepo);
    const editerUnMessage = new EditerUnMessage(hotspotRepo, messageRepo);
    routers.push(
        new MessageRouter(
            new MessageCtrl(
                hotspotRepo,
                messageRepo,
                messageFactory,
                actualiteHotspot,
                obtenirCommentaires,
                publierUnMessage,
                repondreAUnMessage,
                editerUnMessage,
            ),
            userLoader,
        ),
    );
    routers.push(new CityzenRouter(new CityzenCtrl(cityzenRepositoryPostgreSQL), userLoader));

    routers.forEach(r => r.bind(server));
};
