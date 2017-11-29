import config from './config';
import * as routers from './routers/';
import * as console from 'console';
import * as restify from 'restify';

const logger = require('restify-logger');
const swaggerJsDoc = require('swagger-jsdoc');

const server : restify.Server = restify.createServer();

logger.format('standard-format', ':method :url :response-time');
server.use(logger('standard-format'));

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

routers.init(server);

if (module.parent) {
    module.exports = server;
} else {
    server.listen(config.server.httpPort, () => {
        console.log('ready and hope works well on %s', server.url);
    });
}


