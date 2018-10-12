const dbMigrate = require('db-migrate');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

async function runMigration(config) {
    log.info('Database migration started');

    dbMigrateInstance = dbMigrate.getInstance(true, {
        config: 'config/database.json',
        env: config.env
    });

    await dbMigrateInstance.up();
    log.info('Database migration finished');
}

module.exports = {
    run: runMigration
};
