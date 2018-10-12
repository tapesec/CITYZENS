import config from './config';
import * as routers from './routers/';
import * as console from 'console';
import * as restify from 'restify';
import { initDB } from '../infrastructure/database';
const corsMiddleware = require('restify-cors-middleware');

const logger = require('restify-logger');

const server: restify.Server = restify.createServer();

logger.format('standard-format', ':method :url :response-time');
server.use(logger('standard-format'));

const cors = corsMiddleware({
    allowHeaders: [
        'Accept',
        'Accept-Version',
        'Content-Type',
        'Api-Version',
        'Origin',
        'X-Requested-With',
        'Authorization',
    ],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

routers.init(server);

if (module.parent) {
    module.exports = server;
} else {
    initDB()
        .then(() =>
            server.listen(config.server.httpPort, () => {
                console.log('ready and hope works well on %s', server.url);
            }),
        )
        .catch((error: Error) => {
            console.log(`Db initializing error: ${error.message}`);
            process.exit(1);
        });
}
