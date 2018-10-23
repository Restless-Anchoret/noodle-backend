async function getTagNamesByAccountId (client, accountId) {
    return client.query('select distinct tg.name from tag tg ' +
        'inner join task t on t.id = tg.task_id ' +
        'inner join list l on l.id = t.list_id ' +
        'where l.account_id = $1 order by tg.name', [accountId], tag => tag.name);
}

async function getTagNamesByTaskId (client, taskId) {
    return client.query('select name from tag where task_id = $1 order by name', [taskId], tag => tag.name);
}

module.exports = {
    getTagNamesByAccountId: getTagNamesByAccountId,
    getTagNamesByTaskId: getTagNamesByTaskId
};
