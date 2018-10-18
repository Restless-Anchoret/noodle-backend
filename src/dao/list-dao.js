const dbUtils = require('../util/db/utils');

async function getListsByAccountId (client, accountId) {
    return client.query('select * from list where account_id = $1 order by index',
        [accountId], dbUtils.mapFieldsToCamel);
}

async function insertList (client, list) {
    await client.insert(list, 'list');
}

module.exports = {
    getListsByAccountId: getListsByAccountId,
    insertList: insertList
};
