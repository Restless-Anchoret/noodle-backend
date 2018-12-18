'use strict';

const configRetriever = require('./config-retriever');
const migration = require('./migration');
const debugDataService = require('../service/debug-data-service');
const routingConfigurator = require('./routing-configurator');
const appContext = require('./application-context');
const { env } = require('../schema/enum');
const loggerFactory = require('./logger-factory');

async function startApplication (defaultEnv) {
    loggerFactory.configure();
    await configRetriever.retrieve(defaultEnv);
    await runMigration();
    await populateDebugData();
    await routingConfigurator.configure();
}

async function runMigration () {
    if (appContext.isEnv(env.dev, env.devDocker, env.prod)) {
        await migration.up();
    }
}

async function populateDebugData () {
    if (appContext.isEnv(env.dev, env.devDocker)) {
        await debugDataService.populateDebugData();
    }
}

module.exports = {
    startApplication: startApplication
};
