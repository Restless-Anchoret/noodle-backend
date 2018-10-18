const joi = require('joi');

const configSchema = joi.object({
    db: joi.object({
        host: joi.string().hostname().required(),
        port: joi.number().port().required(),
        database: joi.string().required(),
        user: joi.string().required(),
        password: joi.string().required(),
        minConnections: joi.number().integer().positive().required(),
        maxConnections: joi.number().integer().positive().required()
    }).required(),
    http: joi.object({
        port: joi.number().port().required()
    }).required(),
    jwt: joi.object({
        expiresIn: joi.string().required(),
        secret: joi.string().required()
    }).required(),
    env: joi.string().allow(['dev', 'prod', 'test']).required()
});

module.exports = {
    configSchema: configSchema
};
