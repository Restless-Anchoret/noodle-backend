const joi = require('joi');

const titleSchema = joi.string().max(100);

const postListSchema = {
    body: joi.object({
        title: titleSchema.required()
    })
};

const putListSchema = {
    params: joi.object({
        // todo
    }),
    body: joi.object({
        // todo
    })
};

const deleteListSchema = {
    params: joi.object({
        // todo
    })
};

const getListTasksSchema = {
    query: joi.object({
        // todo
    }),
    params: joi.object({
        // todo
    })
};

module.exports = {
    postListSchema: postListSchema,
    putListSchema: putListSchema,
    deleteListSchema: deleteListSchema,
    getListTasksSchema: getListTasksSchema
};
