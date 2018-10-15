const fs = require('fs-extra');
const yaml = require('js-yaml');
const joi = require('joi');
const applicationContext = require('./application-context');
const loggerFactory = require('./logger-factory');

const log = loggerFactory.getLogger(__filename);

const configSchema = joi.object({
    db: joi.object({
        host: joi.string().min(1).required(),
        port: joi.number().port().required(),
        database: joi.string().min(1).required(),
        user: joi.string().min(1).required(),
        password: joi.string().min(1).required(),
        minConnections: joi.number().integer().positive().required(),
        maxConnections: joi.number().integer().positive().required()
    }).required(),
    http: joi.object({
        port: joi.number().port().required()
    }).required(),
    jwt: joi.object({
        expiresIn: joi.string().min(1).required(),
        secret: joi.string().min(1).required()
    }).required(),
    env: joi.string().allow(['dev', 'prod', 'test']).required()
});

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
