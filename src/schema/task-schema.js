const joi = require('joi');
const { taskStatusValues } = require('./enum');
const { idSchema, idParamsSchema } = require('./common-schema');

const titleSchema = joi.string().max(400);
const tagSchema = joi.string().max(100);
const taskStatusSchema = joi.string().valid(taskStatusValues);

const getTasksSchema = {
    query: joi.object({
        list: joi.alternatives().try(
            idSchema, joi.array().items(idSchema)),
        tag: joi.alternatives().try(
            tagSchema, joi.array().items(tagSchema)),
        status: joi.alternatives().try(
            taskStatusSchema, joi.array().items(taskStatusSchema))
    })
};

const getTaskSchema = {
    params: idParamsSchema
};

const postTaskSchema = {
    body: joi.object({
        title: titleSchema.required(),
        parentTaskId: idSchema,
        listId: idSchema
    }).xor('parentTaskId', 'listId')
};

const putTaskSchema = {
    params: idParamsSchema,
    body: joi.object({
        title: titleSchema,
        description: joi.string().empty('').max(2000),
        tags: joi.array().items(tagSchema),
        status: taskStatusSchema
    })
};

const deleteTaskSchema = {
    params: idParamsSchema
};

module.exports = {
    getTasksSchema: getTasksSchema,
    getTaskSchema: getTaskSchema,
    postTaskSchema: postTaskSchema,
    putTaskSchema: putTaskSchema,
    deleteTaskSchema: deleteTaskSchema
};
