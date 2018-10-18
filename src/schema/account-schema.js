const joi = require('joi');
const { nonemptyStringSchema } = require('./common-schema');

const passwordSchema = joi.string().min(8)
    .regex(/^.*[0-9].*$/, 'numbers')
    .regex(/^.*[a-zA-Z].*$/, 'latin letters');

const nameSchema = nonemptyStringSchema.max(100);

const postAccountSchema = {
    body: joi.object({
        login: nonemptyStringSchema.max(50).required(),
        password: passwordSchema.required(),
        name: nameSchema.required()
    })
};

const putAccountSchema = {
    body: joi.object({
        name: nameSchema,
        oldPassword: nonemptyStringSchema,
        newPassword: passwordSchema
    }).and('oldPassword', 'newPassword')
};

const signInSchema = {
    body: joi.object({
        login: nonemptyStringSchema.required(),
        password: nonemptyStringSchema.required()
    })
};

module.exports = {
    postAccountSchema: postAccountSchema,
    putAccountSchema: putAccountSchema,
    signInSchema: signInSchema
};
