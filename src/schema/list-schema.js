const joi = require('joi');
const { idParamsSchema } = require('./common-schema');

const titleSchema = joi.string().max(100);

const postListSchema = {
    body: joi.object({
        title: titleSchema.required()
    })
};

const putListSchema = {
    params: idParamsSchema,
    body: joi.object({
        title: titleSchema.required()
    })
};

const deleteListSchema = {
    params: idParamsSchema
};

const getListTasksSchema = {
    query: joi.object({
        // todo
    }),
    params: idParamsSchema
};

module.exports = {
    postListSchema: postListSchema,
    putListSchema: putListSchema,
    deleteListSchema: deleteListSchema,
    getListTasksSchema: getListTasksSchema
};
