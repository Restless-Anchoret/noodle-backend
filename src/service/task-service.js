const accountDao = require('../dao/account-dao');
const taskDao = require('../dao/task-dao');
const listDao = require('../dao/list-dao');
const tagDao = require('../dao/tag-dao');
const db = require('../util/db/db');
const _ = require('lodash');
const { taskStatus } = require('../schema/enum');

async function getListTasks (context) {
    // todo
}

async function getTasks (context) {
    // todo
}

async function getTaskById (context) {
    const taskId = +(context.params.id);
    const accountId = context.jwtPayload.id;

    return getTaskByIdFromDatabase(db, taskId, accountId);
}

async function getTaskByIdFromDatabase (client, taskId, accountId) {
    const task = await taskDao.getTaskByIdAndAccountId(client, taskId, accountId);
    const taskTagNames = await tagDao.getTagNamesByTaskId(client, taskId);
    const parents = await getTaskParentsHierarchy(client, task);
    return mapTask(task, taskTagNames, parents);
}

async function getTaskParentsHierarchy (client, task) {
    const parentTasks = [];
    let currentTask = task;

    while (currentTask.parentTaskId) {
        const parentTask = await taskDao.getTaskById(db, currentTask.parentTaskId);
        parentTasks.unshift({
            id: parentTask.id,
            title: parentTask.title
        });
        currentTask = parentTask;
    }

    return parentTasks;
}

async function createTask (context) {
    const dto = context.body;
    const accountId = context.jwtPayload.id;

    const { task, parents } = await db.transaction(async client => {
        await accountDao.getAccountByIdForUpdate(client, accountId);
        let newTask;

        if (dto.listId) {
            newTask = await prepareRootTaskObject(client, dto.title, dto.listId, accountId);
        } else {
            newTask = await prepareSubtaskObject(client, dto.title, dto.parentTaskId, accountId);
            await taskDao.updateTaskHasChildren(client, dto.parentTaskId, true);
        }

        await taskDao.insertTask(client, newTask);
        const parents = await getTaskParentsHierarchy(client, newTask);
        return { task: newTask, parents: parents };
    });

    return mapTask(task, [], parents);
}

async function prepareRootTaskObject (client, title, listId, accountId) {
    await listDao.getListByIdAndAccountId(client, listId, accountId);
    const newTaskIndex = await taskDao.getMaximumRootTaskIndex(client, listId) + 1;
    return prepareNewTaskObject(title, null, listId, newTaskIndex);
}

async function prepareSubtaskObject (client, title, parentTaskId, accountId) {
    const parentTask = await taskDao.getTaskByIdAndAccountId(client, parentTaskId, accountId);
    const newTaskIndex = await taskDao.getMaximumSubtaskIndex(client, parentTaskId) + 1;
    return prepareNewTaskObject(title, parentTaskId, parentTask.listId, newTaskIndex);
}

function prepareNewTaskObject (title, parentTaskId, listId, index) {
    return {
        title: title,
        description: '',
        status: taskStatus.toDo,
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
    const dto = context.body;
    const taskId = +(context.params.id);
    const accountId = context.jwtPayload.id;

    return db.transaction(async client => {
        await accountDao.getAccountByIdForUpdate(client, accountId);
        const task = await taskDao.getTaskByIdAndAccountId(client, taskId, accountId);

        await updateTaskProperties(client, task, dto);
        await updateTaskTags(client, taskId, dto);

        return getTaskByIdFromDatabase(client, taskId, accountId);
    });
}

async function updateTaskProperties (client, task, dto) {
    if (!dto.title && !dto.description && !dto.status) {
        return;
    }

    let startDate, endDate;
    if (!task.startDate) {
        startDate = getCurrentDateWithoutTime();
    }
    if (task.status !== taskStatus.done && dto.status === taskStatus.done) {
        endDate = getCurrentDateWithoutTime();
    }

    await taskDao.updateTask(client, task.id, dto.title, dto.description, dto.status, startDate, endDate);
}

function getCurrentDateWithoutTime () {
    const currentTime = new Date().getTime();
    const correctedTime = currentTime - currentTime % (24 * 60 * 60 * 1000);
    return new Date(correctedTime);
}

async function updateTaskTags (client, taskId, dto) {
    if (!dto.tags) {
        return;
    }

    await tagDao.deleteTaskTagsExceptFor(client, taskId, dto.tags);
    const existingTagNames = await tagDao.getTagNamesByTaskId(db, taskId);
    const filteredTagsToAdd = _.filter(dto.tags, tag => !existingTagNames.includes(tag));

    for (const newTag of filteredTagsToAdd) {
        await tagDao.addTaskTag(client, taskId, newTag);
    }
}

async function deleteTask (context) {
    const taskId = +(context.params.id);
    const accountId = context.jwtPayload.id;

    await db.transaction(async client => {
        await accountDao.getAccountByIdForUpdate(client, accountId);
        const task = await taskDao.getTaskByIdAndAccountId(client, taskId, accountId);
        await deleteTaskInDatabase(client, taskId);

        if (!task.parentTaskId) {
            return;
        }

        const leftSubtasks = await taskDao.getTaskSubtasks(client, task.parentTaskId);
        if (leftSubtasks.length === 0) {
            await taskDao.updateTaskHasChildren(client, task.parentTaskId, false);
        }
    });
}

async function deleteTaskInDatabase (client, taskId) {
    const subtasks = await taskDao.getTaskSubtasks(client, taskId);
    for (const subtask of subtasks) {
        await deleteTaskInDatabase(client, subtask.id);
    }

    await tagDao.deleteTaskTags(client, taskId);
    await taskDao.deleteTask(client, taskId);
}

function mapTask (task, tagNames, parentsHierarchy) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        tags: tagNames,
        creationDate: mapDate(task.creationDate),
        startDate: mapDate(task.startDate),
        endDate: mapDate(task.endDate),
        parentsHierarchy: parentsHierarchy
    };
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
