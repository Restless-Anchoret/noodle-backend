'use strict';

const taskService = require('../service/task-service');
const schema = require('../schema/task-schema');

const controller = {
    url: '/tasks',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: schema.getTasksSchema,
            handler: taskService.getTasks
        },
        {
            url: '/:id',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: schema.getTaskSchema,
            handler: taskService.getTaskById
        },
        {
            url: '',
            method: 'post',
            version: 1,
            secured: true,
            validationSchema: schema.postTaskSchema,
            successStatus: 201,
            handler: taskService.createTask
        },
        {
            url: '/:id',
            method: 'put',
            version: 1,
            secured: true,
            validationSchema: schema.putTaskSchema,
            handler: taskService.updateTask
        },
        {
            url: '/:id',
            method: 'delete',
            version: 1,
            secured: true,
            validationSchema: schema.deleteTaskSchema,
            handler: taskService.deleteTask
        }
    ]
};

module.exports = controller;
