const dbUtils = require('../util/db/utils');

async function getTagsByAccountId (client, accountId) {
    return client.query('select * from tag where account_id = $1 order by name',
        [accountId], dbUtils.mapFieldsToCamel);
}

async function getTagsByTaskId (client, taskId) {
    const query = 'select t.* from tag t inner join task_tag tt on tt.tag_id = t.id ' +
        'where tt.task_id = $1 order by t.name';
    return client.query(query, [taskId], dbUtils.mapFieldsToCamel);
}

module.exports = {
    getTagsByAccountId: getTagsByAccountId,
    getTagsByTaskId: getTagsByTaskId
};
