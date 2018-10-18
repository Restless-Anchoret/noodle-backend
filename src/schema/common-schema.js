const joi = require('joi');

const idSchema = joi.number().integer().positive();
const idStringSchema = joi.string().regex(/^[1-9]\d{0,15}$/);
const nonemptyStringSchema = joi.string().min(1);

module.exports = {
    idSchema: idSchema,
    idStringSchema: idStringSchema,
    nonemptyStringSchema: nonemptyStringSchema
};
