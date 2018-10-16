const dbUtils = require('../util/db/utils');

async function getAccountById (client, id) {
    return client.findById(id, 'account');
}

async function getAccountByLogin (client, login) {
    const results = await client.query('select * from account where login = $1', [login], dbUtils.mapFieldsToCamel);
    return dbUtils.getFirstOrNull(results);
}

async function insertAccount (client, account) {
    await client.insert(account, 'account');
}

module.exports = {
    getAccountById: getAccountById,
    getAccountByLogin: getAccountByLogin,
    insertAccount: insertAccount
};
