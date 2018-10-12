const configRetriever = require('./util/config-retriever');
const migration = require('./util/migration');
const loggerFactory = require('./util/logger-factory');

const log = loggerFactory.getLogger(__filename);

async function startApplication() {
    log.info('Noodle initialization started');

    loggerFactory.configure();
    const config = await configRetriever.retrieve();
    await migration.run(config);

    log.info('Noodle initialization finished');
}

startApplication()
    .then(() => log.info('Noodle started successfully'))
    .catch(err => log.error('Noodle initialization failed:', err));
