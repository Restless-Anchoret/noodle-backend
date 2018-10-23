const configRetriever = require('./util/config-retriever');
const migration = require('./util/migration');
const debugDataService = require('./service/debug-data-service');
const routingConfigurator = require('./util/routing-configurator');
const loggerFactory = require('./util/logger-factory');

const log = loggerFactory.getLogger(__filename);

async function startApplication () {
    loggerFactory.configure();
    await configRetriever.retrieve();
    await migration.run();
    await debugDataService.populateDebugData();
    await routingConfigurator.configure();
}

startApplication()
    .then(() => log.info('Noodle started successfully'))
    .catch(err => log.error('Noodle initialization failed:', err));
