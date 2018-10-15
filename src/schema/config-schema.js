const joi = require('joi');

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

module.exports = {
    configSchema: configSchema
};
