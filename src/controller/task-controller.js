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
            successStatus: 201,
            handler: taskService.getTaskById
        },
        {
            url: '',
            method: 'post',
            version: 1,
            secured: true,
            validationSchema: schema.postTaskSchema,
            handler: taskService.createTask
        },
        {
            url: '',
            method: 'put',
            version: 1,
            secured: true,
            validationSchema: schema.putTaskSchema,
            handler: taskService.updateTask
        },
        {
            url: '',
            method: 'delete',
            version: 1,
            secured: true,
            validationSchema: schema.deleteTaskSchema,
            handler: taskService.deleteTask
        }
    ]
};

module.exports = controller;
