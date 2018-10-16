async function getAccountById (client, id) {
    return client.findById(id, 'account');
}

async function insertAccount (client, account) {
    await client.insert(account, 'account');
}

module.exports = {
    getAccountById: getAccountById,
    insertAccount: insertAccount
};
