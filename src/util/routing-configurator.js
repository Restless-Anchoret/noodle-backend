const express = require('express');
const controllerRegistry = require('../controller/registry');
const appContext = require('./application-context');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

async function configureRouting() {
    log.info('Routing configuration started');

    const app = express();
    const controllers = controllerRegistry.controllers;

    addJwtMiddleware(app);
    configureControllers(app, controllers);
    await listenPort(app, appContext.config.http.port);

    log.info('Routing configuration finished');
}

function addJwtMiddleware(app) {
    // todo: add jwt middleware
}

function configureControllers(app, controllers) {
    controllers.forEach(controller => {
        controller.endPoints.forEach(endPoint => {
            configureEndPoint(app, controller, endPoint);
        });
    });
}

function configureEndPoint(app, controller, endPoint) {
    const url = `/api/v${endPoint.version}${controller.url}${endPoint.url}`;
    app[endPoint.method](url, (request, response) => {
        log.debug('Request to:', request.url);
        // todo: add secure middleware
        // todo: add validation middleware
        // todo: build context
        endPoint.handler()
            .then(result => response.json(result))
            .catch(err => log.error(err)); // todo: add error middleware
    });
    log.debug('Route configured:', endPoint.method, url);
}

function listenPort(app, port) {
    return new Promise((resolve, reject) => {
        app.listen(port, (err) => {
            if (err) {
                reject(err);
            } else {
                log.info('Listening on port', port);
                resolve();
            }
        });
    });
}

module.exports = {
    configure: configureRouting
};
