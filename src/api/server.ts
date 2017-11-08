require('dotenv').config();
import HotspotCtrl from './controllers/HotspotCtrl';
import * as routers from './routers/';
import * as console from 'console';
import * as restify from 'restify';
import config from './config';

const logger = require('restify-logger');
const swaggerJsDoc = require('swagger-jsdoc');

const server : restify.Server = restify.createServer();

logger.format('standard-format', ':method :url :response-time');
server.use(logger('standard-format'));

server.use(restify.plugins.queryParser());

routers.init(server);

server.listen(config.server.httpPort || 3000, () => {
    console.log('ready and hope works well on %s', server.url);
});
