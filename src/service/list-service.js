const accountDao = require('../dao/account-dao');
const listDao = require('../dao/list-dao');
const _ = require('lodash');
const db = require('../util/db/db');

async function getLists (context) {
    const accountId = context.jwtPayload.id;
    const lists = await listDao.getListsByAccountId(db, accountId);
    const mappedLists = _.map(lists, list => mapList(list));
    return { items: mappedLists };
}

async function createList (context) {
    const accountId = context.jwtPayload.id;
    const dto = context.body;

    const newList = await db.transaction(async client => {
        await accountDao.getAccountByIdForUpdate(client, accountId);
        const existingLists = await listDao.getListsByAccountId(client, accountId);

        const newList = {
            title: dto.title,
            index: existingLists.length,
            accountId: accountId
        };
        await listDao.insertList(client, newList);
        return newList;
    });

    return mapList(newList);
}

async function updateList (context) {
    // todo
}

async function deleteList (context) {
    // todo
}

function mapList (list) {
    return {
        id: list.id,
        title: list.title
    };
}

module.exports = {
    getLists: getLists,
    createList: createList,
    updateList: updateList,
    deleteList: deleteList
};
