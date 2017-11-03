import * as restify from 'restify';
const swaggerJsDoc = require('swagger-jsdoc');

class SwaggerRouter {

    private swaggerDefinition : any;
    private options : any;

    constructor() {
        this.swaggerDefinition = {
            info: { // API informations (required)
                title: 'Cityzens API', // Title (required)
                version: '1.0.0', // Version (required)
                description: 'Cityzens REST API needed by the platform', // Description (optional)
            },
            host: 'localhost:3000', // Host (optional)
            basePath: '/', // Base path (optional)
        };

        this.options = {
            // Import swaggerDefinitions
            swaggerDefinition: this.swaggerDefinition,
            // Path to the API docs
            apis: ['./build/api/routers/HotspotRouter.js'],
        };
    }

    bind(server : restify.Server) {
        const swaggerSpec = swaggerJsDoc(this.options);

        server.get(/\/api-docs\/?.*/, restify.plugins.serveStatic({
            directory: __dirname + '../../../../',
            default: 'index.html',
        }));

        server.get('/swagger.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    }
}

export default SwaggerRouter;