const joi = require('joi');
const { nonemptyStringSchema } = require('./common-schema');

const configSchema = joi.object({
    db: joi.object({
        host: joi.string().hostname().required(),
        port: joi.number().port().required(),
        database: nonemptyStringSchema.required(),
        user: nonemptyStringSchema.required(),
        password: nonemptyStringSchema.required(),
        minConnections: joi.number().integer().positive().required(),
        maxConnections: joi.number().integer().positive().required()
    }).required(),
    http: joi.object({
        port: joi.number().port().required()
    }).required(),
    jwt: joi.object({
        expiresIn: nonemptyStringSchema.required(),
        secret: nonemptyStringSchema.required()
    }).required(),
    env: joi.string().allow(['dev', 'prod', 'test']).required()
});

module.exports = {
    configSchema: configSchema
};
