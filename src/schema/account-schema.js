const joi = require('joi');

const passwordSchema = joi.string().min(8)
    .regex(/^.*[0-9].*$/, 'numbers')
    .regex(/^.*[a-zA-Z].*$/, 'latin letters');

const postAccountSchema = {
    body: joi.object({
        login: joi.string().min(1).max(50).required(),
        password: passwordSchema.required(),
        name: joi.string().min(1).max(100).required()
    })
};

// todo
const putAccountSchema = {};

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
