const listService = require('../service/list-service');
const taskService = require('../service/task-service');
const schema = require('../schema/list-schema');

const controller = {
    url: '/lists',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            handler: listService.getLists
        },
        {
            url: '',
            method: 'post',
            version: 1,
            secured: true,
            validationSchema: schema.postListSchema,
            successStatus: 201,
            handler: listService.createList
        },
        {
            url: '/:id',
            method: 'put',
            version: 1,
            secured: true,
            validationSchema: schema.putListSchema,
            handler: listService.updateList
        },
        {
            url: '/:id',
            method: 'delete',
            version: 1,
            secured: true,
            validationSchema: schema.deleteListSchema,
            handler: listService.deleteList
        },
        {
            url: '/:id/tasks',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: schema.getListTasksSchema,
            handler: taskService.getListTasks
        }
    ]
};

module.exports = controller;
