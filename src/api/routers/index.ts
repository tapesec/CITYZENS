import * as AlgoliaSearch from 'algoliasearch';
import * as restify from 'restify';

import ICityzenRepository from '../../application/domain/cityzen/ICityzenRepository';
import Carte from '../../application/domain/hotspot/Carte';
import MessageFactory from '../../application/domain/hotspot/MessageFactory';
import ActualiteHotspot from '../../application/usecases/ActualiteHotspot';
import CompteUneVue, { ComptabiliseUneVue } from '../../application/usecases/ComptabiliseUneVue';
import ConfirmeExistence from '../../application/usecases/ConfirmeExistence';
import EditerUnMessage from '../../application/usecases/EditerUnMessage';
import HotspotParSlugOuId, {
    IHotspotParSlugOuId,
} from '../../application/usecases/HotspotParSlugOuId';
import HotspotsParCodeInsee, {
    IHotspotsParCodeInsee,
} from '../../application/usecases/HotspotsParCodeInsee';
import HotspotsParZone, { IHotspotsParZone } from '../../application/usecases/HotspotsParZone';
import ModifierUnHotspot from '../../application/usecases/ModifierUnHotspot';
import NouveauHotspot, { INouveauHotspot } from '../../application/usecases/NouveauHotspot';
import ObtenirCommentaires from '../../application/usecases/ObtenirCommentaires';
import PublierUnMessage from '../../application/usecases/PublierUnMessage';
import RepondreAUnMessage from '../../application/usecases/RepondreAUnMessage';
import SupprimerUnHotspot from '../../application/usecases/SupprimerUnHotspot';
import SupprimerUnMessage from '../../application/usecases/SupprimerUnMessage';
import CityRepositoryPostgreSQL from '../../infrastructure/CityRepositoryPostgreSQL';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import HotspotRepositoryPostgreSQL from '../../infrastructure/HotspotRepositoryPostgreSQL';
import pg from '../../infrastructure/libs/postgreSQL/postgreSQL';
import MessageRepositoryPostgreSql from '../../infrastructure/MessageRepositoryPostgreSQL';
import OrmCityzen from '../../infrastructure/ormCityzen';
import { default as OrmHotspot } from '../../infrastructure/ormHotspot';
import OrmMessage from '../../infrastructure/ormMessage';
import config from '../config';
import AuthCtrl from '../controllers/AuthCtrl';
import CityCtrl from '../controllers/CityCtrl';
import CityzenCtrl from '../controllers/CityzenCtrl';
import HotspotCtrl from '../controllers/HotspotCtrl';
import MessageCtrl from '../controllers/MessageCtrl';
import AlgoliaApi from '../libs/AlgoliaAPI';
import auth0Sdk from '../libs/Auth0';
import { createlogger } from '../libs/MCDVLogger';
import { createWebhook } from '../libs/SlackWebhook';
import UserLoader from '../middlewares/UserLoader';
import Algolia from '../services/algolia/Algolia';
import Auth0Service from '../services/auth/Auth0Service';
import ErrorHandler from '../services/errors/ResponseError';
import FilestackService from '../services/filestack/FilestackService';
import SlideshowService from '../services/widgets/SlideshowService';
import AuthRouter from './AuthRouter';
import CityRouter from './CityRouter';
import CityzenRouter from './CityzenRouter';
import HotspotRouter from './HotspotRouter';
import MessageRouter from './MessageRouter';
import SwaggerRouter from './SwaggerRouter';
import ProfileCityzen from '../../application/usecases/ProfileCityzen';
import MettreAJourProfileCityzen from '../../application/usecases/MettreAJourProfileCityzen';
import VilleParSlug from '../../application/usecases/VilleParSlug';

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
const filestackService = new FilestackService(request);
const slideshowService = new SlideshowService(filestackService);

const cityzenRepositoryPostgreSQL: ICityzenRepository = new CityzenRepositoryPostgreSQL(ormCityzen);
const hotspotRepo: Carte = new HotspotRepositoryPostgreSQL(ormHotspot, algolia, slideshowService);
const messageRepo = new MessageRepositoryPostgreSql(ormMessage, messageFactory);
const cityRepositoryPostgreSQL = new CityRepositoryPostgreSQL(pg);

export const init = (server: restify.Server) => {
    const routers = [];
    const userLoader = new UserLoader(auth0Service, cityzenRepositoryPostgreSQL);
    routers.push(new SwaggerRouter());
    routers.push(new AuthRouter(new AuthCtrl(auth0Service), userLoader));
    // use cases
    const villeParSlug = new VilleParSlug(cityRepositoryPostgreSQL);
    routers.push(new CityRouter(new CityCtrl(villeParSlug)));

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
    const supprimerUnMessage = new SupprimerUnMessage(hotspotRepo, messageRepo);
    routers.push(
        new MessageRouter(
            new MessageCtrl(
                actualiteHotspot,
                obtenirCommentaires,
                publierUnMessage,
                repondreAUnMessage,
                editerUnMessage,
                supprimerUnMessage,
            ),
            userLoader,
        ),
    );
    // use cases
    const profileCityzen = new ProfileCityzen(cityzenRepositoryPostgreSQL);
    const mettreAJourProfileCityzen = new MettreAJourProfileCityzen(cityzenRepositoryPostgreSQL);
    routers.push(
        new CityzenRouter(new CityzenCtrl(profileCityzen, mettreAJourProfileCityzen), userLoader),
    );

    routers.forEach(r => r.bind(server));
};
