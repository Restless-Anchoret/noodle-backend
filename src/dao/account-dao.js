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

async function updateAccount (client, id, name, passwordHash) {
    const params = [];
    const querySetParts = [];

    if (name) {
        params.push(name);
        querySetParts.push(`name = $${params.length}`);
    }

    if (passwordHash) {
        params.push(passwordHash);
        querySetParts.push(`password_hash = $${params.length}`);
    }

    params.push(id);
    const query = `update account set ${querySetParts.join(', ')} where id = $${params.length}`;
    await client.query(query, params);
}

module.exports = {
    getAccountById: getAccountById,
    getAccountByLogin: getAccountByLogin,
    insertAccount: insertAccount,
    updateAccount: updateAccount
};
