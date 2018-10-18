const joi = require('joi');
const { idSchema, idStringSchema, nonemptyStringSchema } = require('./common-schema');

const getTasksSchema = {
    query: joi.object({
        // todo
    })
};

const getTaskSchema = {
    params: joi.object({
        id: idStringSchema.required()
    })
};

const postTaskSchema = {
    body: joi.object({
        title: nonemptyStringSchema.max(400).required(),
        parentTaskId: idSchema,
        listId: idSchema
    }).xor('parentTaskId', 'listId')
};

const putTaskSchema = {
    params: joi.object({
        // todo
    }),
    body: joi.object({
        // todo
    })
};

const deleteTaskSchema = {
    params: joi.object({
        // todo
    })
};

module.exports = {
    getTasksSchema: getTasksSchema,
    getTaskSchema: getTaskSchema,
    postTaskSchema: postTaskSchema,
    putTaskSchema: putTaskSchema,
    deleteTaskSchema: deleteTaskSchema
};
