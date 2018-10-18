const joi = require('joi');

const idSchema = joi.number().integer().positive();

const idParamsSchema = joi.object({
    id: joi.string().regex(/^[1-9]\d{0,15}$/).required()
});

module.exports = {
    idSchema: idSchema,
    idParamsSchema: idParamsSchema
};
