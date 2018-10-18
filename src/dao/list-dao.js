const dbUtils = require('../util/db/utils');

async function getListsByAccountId (client, accountId) {
    return client.query('select * from list where account_id = $1 order by index',
        [accountId], dbUtils.mapFieldsToCamel);
}

async function getListByIdAndAccountId (client, listId, accountId) {
    const results = await client.query('select * from list where id = $1 and account_id = $2',
        [listId, accountId], dbUtils.mapFieldsToCamel);
    return dbUtils.getOnly(results);
}

async function insertList (client, list) {
    await client.insert(list, 'list');
}

module.exports = {
    getListsByAccountId: getListsByAccountId,
    getListByIdAndAccountId: getListByIdAndAccountId,
    insertList: insertList
};
