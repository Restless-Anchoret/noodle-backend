const dbUtils = require('../util/db/utils');
const _ = require('lodash');

async function getTaskById (client, taskId) {
    return client.findById(taskId, 'task');
}

async function getTaskByIdAndAccountId (client, taskId, accountId) {
    const query = 'select t.* from task t inner join list l on l.id = t.list_id ' +
        'where t.id = $1 and l.account_id = $2';
    const results = await client.query(query, [taskId, accountId], dbUtils.mapFieldsToCamel);
    return dbUtils.getOnly(results);
}

async function getListRootTasks (client, listId) {
    return client.query('select * from task where list_id = $1 and parent_task_id is null order by index',
        [listId], dbUtils.mapFieldsToCamel);
}

async function getMaximumRootTaskIndex (client, listId) {
    const results = await client.query('select max(index) as index from task ' +
        'where list_id = $1 and parent_task_id is null', [listId], result => +result.index);
    return dbUtils.getOnly(results);
}

async function getTaskSubtasks (client, parentTaskId) {
    return client.query('select * from task where parent_task_id = $1 order by index',
        [parentTaskId], dbUtils.mapFieldsToCamel);
}

async function getMaximumSubtaskIndex (client, parentTaskId) {
    const results = await client.query('select max(index) as index from task where parent_task_id = $1',
        [parentTaskId], result => +result.index);
    return dbUtils.getOnly(results);
}

async function getTasks (client, listIds, tags, statuses) {
    const tasks = [];
    const collector = createTaskTagsCollector(tasks);

    await client.query('select t.id as task_id, t.title, t.status, tg.name ' +
        'from task t left join tag tg on tg.task_id = t.id ' +
        'where t.list_id = any ($1) and t.status = any ($2) ' +
        'order by t.creation_date desc', [listIds, statuses], collector);

    return _.filter(tasks, task => {
        return _.every(tags, tag => task.tags.includes(tag));
    });
}

function createTaskTagsCollector (tasks) {
    return row => {
        if (tasks.length > 0 && tasks[tasks.length - 1].id === row['task_id']) {
            tasks[tasks.length - 1].tags.push(row.name);
            return;
        }

        tasks.push({
            id: row['task_id'],
            title: row.title,
            status: row.status,
            tags: row.name ? [row.name] : []
        });
    };
}

async function insertTask (client, task) {
    return client.insert(task, 'task');
}

async function updateTask (client, id, title, description, status, startDate, endDate) {
    const params = [];
    const querySetParts = [];

    if (title) {
        params.push(title);
        querySetParts.push(`title = $${params.length}`);
    }

    if (description) {
        params.push(description);
        querySetParts.push(`description = $${params.length}`);
    }

    if (status) {
        params.push(status);
        querySetParts.push(`status = $${params.length}`);
    }

    if (startDate !== undefined) {
        params.push(startDate);
        querySetParts.push(`start_date = $${params.length}`);
    }

    if (endDate !== undefined) {
        params.push(endDate);
        querySetParts.push(`end_date = $${params.length}`);
    }

    params.push(id);
    const query = `update task set ${querySetParts.join(', ')} where id = $${params.length}`;
    await client.query(query, params);
}

async function updateTaskHasChildren (client, id, hasChildren) {
    await client.query('update task set has_children = $1 where id = $2', [hasChildren, id]);
}

async function deleteTask (client, taskId) {
    await client.query('delete from task where id = $1', [taskId]);
}

async function deleteTasksFromList (client, listId) {
    await client.query('delete from task where list_id = $1', [listId]);
}

module.exports = {
    getTaskById: getTaskById,
    getTaskByIdAndAccountId: getTaskByIdAndAccountId,
    getListRootTasks: getListRootTasks,
    getMaximumRootTaskIndex: getMaximumRootTaskIndex,
    getTaskSubtasks: getTaskSubtasks,
    getMaximumSubtaskIndex: getMaximumSubtaskIndex,
    getTasks: getTasks,
    insertTask: insertTask,
    updateTask: updateTask,
    updateTaskHasChildren: updateTaskHasChildren,
    deleteTask: deleteTask,
    deleteTasksFromList: deleteTasksFromList
};
