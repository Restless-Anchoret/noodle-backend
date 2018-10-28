'use strict';

const dbMigrate = require('db-migrate');
const appContext = require('./application-context');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

async function runMigration () {
    log.info('Database migration started');

    const config = appContext.config;
    const dbMigrateConfig = {
        config: {},
        env: config.env
    };

    dbMigrateConfig.config[config.env] = {
        driver: 'pg',
        user: config.db.user,
        password: config.db.password,
        host: config.db.host,
        port: config.db.port,
        database: config.db.database
    };

    const dbMigrateInstance = dbMigrate.getInstance(true, dbMigrateConfig);
    await dbMigrateInstance.up();
    log.info('Database migration finished');
}

module.exports = {
    run: runMigration
};
