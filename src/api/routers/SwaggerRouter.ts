import * as restify from 'restify';
import * as path from 'path';

const swaggerJsDoc = require('swagger-jsdoc');

class SwaggerRouter {

    private swaggerDefinition : any;
    private options : any;

    constructor() {
        this.swaggerDefinition = {
            info: { // API informations (required)
                title: 'API Cityzens', // Title (required)
                version: '0.0.1', // Version (required)
                description: 'REST API, Cityzens: https://github.com/tapesec/CITYZENS', // Description (optional)
            },
            host: 'localhost:3000', // Host (optional)
            basePath: '/', // Base path (optional)
        };

        this.options = {
            // Import swaggerDefinitions
            swaggerDefinition: this.swaggerDefinition,
            // Path to the API docs
            apis: [
                `./src/api/routers/documentation/**/*.yaml`,
            ],
        };
    }

    bind(server : restify.Server) {
        const swaggerSpec = swaggerJsDoc(this.options);
        server.get(/\/api-docs\/?.*/, restify.plugins.serveStatic({
            directory: path.normalize(__dirname + '/../../../'),
            default: 'index.html',
        }));

        server.get('/swagger.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    }
}

export default SwaggerRouter;
