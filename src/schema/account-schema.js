const joi = require('joi');

const passwordSchema = joi.string().min(8)
    .regex(/^.*[0-9].*$/, 'numbers')
    .regex(/^.*[a-zA-Z].*$/, 'latin letters');

const nameSchema = joi.string().max(100);

const postAccountSchema = {
    body: joi.object({
        login: joi.string().max(50).required(),
        password: passwordSchema.required(),
        name: nameSchema.required()
    })
};

const putAccountSchema = {
    body: joi.object({
        name: nameSchema,
        oldPassword: joi.string(),
        newPassword: passwordSchema
    }).and('oldPassword', 'newPassword')
};

const signInSchema = {
    body: joi.object({
        login: joi.string().required(),
        password: joi.string().required()
    })
};

module.exports = {
    postAccountSchema: postAccountSchema,
    putAccountSchema: putAccountSchema,
    signInSchema: signInSchema
};
