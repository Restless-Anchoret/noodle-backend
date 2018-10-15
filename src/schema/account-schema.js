const joi = require('joi');

const postAccountSchema = {
    body: joi.object({
        login: joi.string().min(1).max(50).required(),
        password: joi.string().min(8)
            .regex(/^.*[0-9].*$/, 'numbers')
            .regex(/^.*[a-zA-Z].*$/, 'latin letters'),
        name: joi.string().min(1).max(100).required()
    })
};

// todo
const putAccountSchema = {};

// todo
const signInSchema = {};

module.exports = {
    postAccountSchema: postAccountSchema,
    putAccountSchema: putAccountSchema,
    signInSchema: signInSchema
};
