const accountDao = require('../dao/account-dao');
const taskDao = require('../dao/task-dao');
const listDao = require('../dao/list-dao');
const tagDao = require('../dao/tag-dao');
const db = require('../util/db/db');
const _ = require('lodash');

async function getListTasks (context) {
    // todo
}

async function getTasks (context) {
    // todo
}

async function getTaskById (context) {
    const taskId = +(context.params.id);
    const accountId = context.jwtPayload.id;

    const task = await taskDao.getTaskById(db, taskId);
    await listDao.getListByIdAndAccountId(db, task.listId, accountId);

    const taskTags = await tagDao.getTagsByTaskId(db, taskId);
    return mapTask(task, taskTags);
}

async function createTask (context) {
    const dto = context.body;
    const accountId = context.jwtPayload.id;

    const task = await db.transaction(async client => {
        await accountDao.getAccountByIdForUpdate(client, accountId);
        const newTask = await (dto.listId ? prepareRootTaskObject(client, dto.title, dto.listId, accountId)
            : prepareSubtaskObject(client, dto.title, dto.parentTaskId, accountId));
        await taskDao.insertTask(client, newTask);
        return newTask;
    });

    return mapTask(task);
}

async function prepareRootTaskObject (client, title, listId, accountId) {
    await listDao.getListByIdAndAccountId(client, listId, accountId);
    const rootTasks = await taskDao.getListRootTasks(client, listId);
    return prepareNewTaskObject(title, null, listId, rootTasks.length);
}

async function prepareSubtaskObject (client, title, parentTaskId, accountId) {
    const parentTask = await taskDao.getTaskById(client, parentTaskId);
    await listDao.getListByIdAndAccountId(client, parentTask.listId, accountId);
    const subtasks = await taskDao.getTaskSubtasks(client, parentTaskId);
    return prepareNewTaskObject(title, parentTaskId, parentTask.listId, subtasks.length);
}

function prepareNewTaskObject (title, parentTaskId, listId, index) {
    return {
        title: title,
        description: '',
        status: 'TO_DO',
        parentTaskId: parentTaskId,
        hasChildren: false,
        listId: listId,
        index: index,
        creationDate: new Date(),
        startDate: null,
        endDate: null,
        planningDate: null,
        deadline: null
    };
}

async function updateTask (context) {
    // todo
}

async function deleteTask (context) {
    // todo
}

function mapTask (task, tags) {
    const mappedTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        tags: [],
        creationDate: mapDate(task.creationDate),
        startDate: mapDate(task.startDate),
        endDate: mapDate(task.endDate)
    };

    if (tags) {
        mappedTask.tags = _.map(tags, tag => tag.name);
    }
    return mappedTask;
}

function mapDate (date) {
    if (!date) {
        return date;
    }

    const isoDate = date.toISOString();
    const tIndex = isoDate.indexOf('T');
    return isoDate.slice(0, tIndex);
}

module.exports = {
    getListTasks: getListTasks,
    getTasks: getTasks,
    getTaskById: getTaskById,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask
};
