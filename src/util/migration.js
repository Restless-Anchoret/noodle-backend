'use strict';

const dbMigrate = require('db-migrate');
const appContext = require('./application-context');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

async function up () {
    log.info('Database migration up started');
    const dbMigrateInstance = getDbMigrateInstance();
    await dbMigrateInstance.up();
    log.info('Database migration up finished');
}

async function reset () {
    log.info('Database migration reset started');
    const dbMigrateInstance = getDbMigrateInstance();
    await dbMigrateInstance.reset();
    log.info('Database migration reset finished');
}

function getDbMigrateInstance () {
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

    return dbMigrate.getInstance(true, dbMigrateConfig);
}

module.exports = {
    up: up,
    reset: reset
};
