const dbMigrate = require('db-migrate');
const appContext = require('./application-context');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

async function runMigration () {
    log.info('Database migration started');

    const dbMigrateInstance = dbMigrate.getInstance(true, {
        config: 'config/database.json',
        env: appContext.config.env
    });

    await dbMigrateInstance.up();
    log.info('Database migration finished');
}

module.exports = {
    run: runMigration
};
