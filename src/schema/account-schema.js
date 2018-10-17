const joi = require('joi');

const passwordSchema = joi.string().min(8)
    .regex(/^.*[0-9].*$/, 'numbers')
    .regex(/^.*[a-zA-Z].*$/, 'latin letters');

const nameSchema = joi.string().min(1).max(100);

const postAccountSchema = {
    body: joi.object({
        login: joi.string().min(1).max(50).required(),
        password: passwordSchema.required(),
        name: nameSchema.required()
    })
};

const putAccountSchema = {
    body: joi.object({
        name: nameSchema,
        oldPassword: joi.string().min(1),
        newPassword: passwordSchema
    }).and('oldPassword', 'newPassword')
};

const signInSchema = {
    body: joi.object({
        login: joi.string().min(1).required(),
        password: joi.string().min(1).required()
    })
};

module.exports = {
    postAccountSchema: postAccountSchema,
    putAccountSchema: putAccountSchema,
    signInSchema: signInSchema
};
