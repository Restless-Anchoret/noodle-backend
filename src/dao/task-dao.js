const dbUtils = require('../util/db/utils');

async function getTaskById (client, id) {
    return client.findById(id, 'task');
}

async function getListRootTasks (client, listId) {
    return client.query('select * from task where list_id = $1 and parent_task_id is null order by index',
        [listId], dbUtils.mapFieldsToCamel);
}

async function getTaskSubtasks (client, parentTaskId) {
    return client.query('select * from task where parent_task_id = $1 order by index',
        [parentTaskId], dbUtils.mapFieldsToCamel);
}

async function insertTask (client, task) {
    return client.insert(task, 'task');
}

module.exports = {
    getTaskById: getTaskById,
    getListRootTasks: getListRootTasks,
    getTaskSubtasks: getTaskSubtasks,
    insertTask: insertTask
};
