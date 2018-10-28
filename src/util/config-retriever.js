'use strict';

const fs = require('fs-extra');
const yaml = require('js-yaml');
const joi = require('joi');
const applicationContext = require('./application-context');
const { configSchema } = require('../schema/config-schema');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

async function retrieveConfig () {
    log.info('Reading config');

    const env = getEnv();
    log.debug('Environment:', env);

    const config = await parseConfig(env);
    log.info('Config parsing passed');
    log.trace('Parsed config:', config);

    validateConfig(config);
    log.info('Config validation passed');

    applicationContext.config = config;
    log.debug('Config was put into application context');
}

function getEnv () {
    return process.env['NODE_ENV'] || 'dev';
}

async function parseConfig (env) {
    const configPath = `config/config.${env}.yaml`;
    log.debug('Reading config from:', configPath);

    const yamlConfig = await fs.readFile(configPath, 'utf8');
    log.trace('Read YAML config:', yamlConfig);

    const config = yaml.safeLoad(yamlConfig);
    config.env = env;

    return config;
}

function validateConfig (config) {
    const validationResult = joi.validate(config, configSchema);
    log.trace('Validation result:', validationResult);

    if (validationResult.error) {
        throw validationResult.error;
    }
}

module.exports = {
    retrieve: retrieveConfig
};
