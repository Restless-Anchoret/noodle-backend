const tagDao = require('../dao/tag-dao');
const db = require('../util/db/db');

async function getTags (context) {
    const accountId = context.jwtPayload.id;
    const tagNames = await tagDao.getTagNamesByAccountId(db, accountId);
    return { items: tagNames };
}

module.exports = {
    getTags: getTags
};
