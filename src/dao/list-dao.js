const dbUtils = require('../util/db/utils');

async function getListsByAccountId (client, accountId) {
    return client.query('select * from list where account_id = $1 order by index',
        [accountId], dbUtils.mapFieldsToCamel);
}

module.exports = {
    getListsByAccountId: getListsByAccountId
};
