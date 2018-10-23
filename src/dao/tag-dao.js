async function getTagNamesByAccountId (client, accountId) {
    return client.query('select distinct tg.name from tag tg ' +
        'inner join task t on t.id = tg.task_id ' +
        'inner join list l on l.id = t.list_id ' +
        'where l.account_id = $1 order by tg.name', [accountId], tag => tag.name);
}

async function getTagNamesByTaskId (client, taskId) {
    return client.query('select name from tag where task_id = $1 order by name', [taskId], tag => tag.name);
}

async function deleteTaskTagsExceptFor (client, taskId, exceptTags) {
    await client.query('delete from tag where task_id = $1 and name != all ($2)', [taskId, exceptTags]);
}

async function addTaskTag (client, taskId, newTag) {
    await client.query('insert into tag(name, task_id) values ($1, $2)', [newTag, taskId]);
}

async function deleteTaskTags (client, taskId) {
    await client.query('delete from tag where task_id = $1', [taskId]);
}

module.exports = {
    getTagNamesByAccountId: getTagNamesByAccountId,
    getTagNamesByTaskId: getTagNamesByTaskId,
    deleteTaskTagsExceptFor: deleteTaskTagsExceptFor,
    addTaskTag: addTaskTag,
    deleteTaskTags: deleteTaskTags
};
