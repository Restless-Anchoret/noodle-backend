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
        // todo
    })
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
