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
        const newListIndex = await listDao.getMaximumListIndexByAccountId(client, accountId) + 1;

        const newList = {
            title: dto.title,
            index: newListIndex,
            accountId: accountId
        };
        await listDao.insertList(client, newList);
        return newList;
    });

    return mapList(newList);
}

async function updateList (context) {
    const accountId = context.jwtPayload.id;
    const listId = +(context.params.id);
    const dto = context.body;

    const updatedList = await db.transaction(async client => {
        await accountDao.getAccountByIdForUpdate(client, accountId);
        const list = await listDao.getListByIdAndAccountId(client, listId, accountId);
        await listDao.updateList(client, listId, dto.title);

        list.title = dto.title;
        return list;
    });

    return mapList(updatedList);
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
