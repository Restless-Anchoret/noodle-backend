'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const controllerRegistry = require('../controller/registry');
const appContext = require('./application-context');
const jwtMiddleware = require('../middleware/jwt-middleware');
const errorMiddleware = require('../middleware/error-middleware');
const validationMiddleware = require('../middleware/validation-middleware');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);
const app = express();
let server;

async function configureRouting () {
    log.info('Routing configuration started');

    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    configureControllers(controllerRegistry.controllers);
    await listenPort(appContext.config.http.port);

    log.info('Routing configuration finished');
}

function configureControllers (controllers) {
    controllers.forEach(controller => {
        controller.endPoints.forEach(endPoint => {
            configureEndPoint(controller, endPoint);
        });
    });
}

function configureEndPoint (controller, endPoint) {
    const url = `/api/v${endPoint.version}${controller.url}${endPoint.url}`;
    app[endPoint.method](url, (request, response) => {
        log.debug('Request to:', endPoint.method, request.url);
        processRequest(request, response, endPoint)
            .then(result => processResponse(response, result, endPoint))
            .catch(err => errorMiddleware(request, response, err));
    });
    log.debug('Route configured:', endPoint.method, url);
}

async function processRequest (request, response, endPoint) {
    await jwtMiddleware(request, response, endPoint.secured);
    validationMiddleware(request, response, endPoint.validationSchema);
    const requestContext = buildRequestContext(request);
    return endPoint.handler(requestContext);
}

function buildRequestContext (request) {
    return {
        body: request.body,
        query: request.query,
        params: request.params,
        jwtPayload: request.jwtPayload
    };
}

function processResponse (response, requestResult, endPoint) {
    if (!requestResult) {
        response.status(204);
        response.send();
        return;
    }

    response.status(endPoint.successStatus || 200);
    response.json(requestResult);
}

function listenPort (port) {
    return new Promise((resolve, reject) => {
        server = http.createServer(app);
        server.listen(port, (err) => {
            if (err) {
                reject(err);
            } else {
                log.info('Listening on port', port);
                resolve();
            }
        });
    });
}

async function closeServer () {
    await server.close();
}

module.exports = {
    configure: configureRouting,
    closeServer: closeServer,
    app: app
};
