const dbUtils = require('../util/db/utils');

async function getTagsByAccountId (client, accountId) {
    return client.query('select * from tag where account_id = $1 order by name',
        [accountId], dbUtils.mapFieldsToCamel);
}

module.exports = {
    getTagsByAccountId: getTagsByAccountId
};
