const dbUtils = require('../util/db/utils');

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

    if (startDate) {
        params.push(startDate);
        querySetParts.push(`start_date = $${params.length}`);
    }

    if (endDate) {
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
    insertTask: insertTask,
    updateTask: updateTask,
    updateTaskHasChildren: updateTaskHasChildren,
    deleteTask: deleteTask,
    deleteTasksFromList: deleteTasksFromList
};
