const joi = require('joi');

const getTasksSchema = {
    query: joi.object({
        // todo
    })
};

const getTaskSchema = {
    params: joi.object({
        // todo
    })
};

const postTaskSchema = {
    body: joi.object({
        title: joi.string().min(1).max(400).required(),
        parentTaskId: joi.number().integer().min(1),
        listId: joi.number().integer().min(1)
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
