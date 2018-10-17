const tagDao = require('../dao/tag-dao');
const db = require('../util/db/db');
const _ = require('lodash');

async function getTags (context) {
    const accountId = context.jwtPayload.id;
    const tags = await tagDao.getTagsByAccountId(db, accountId);
    const tagNames = _.map(tags, tag => tag.name);
    return { items: tagNames };
}

module.exports = {
    getTags: getTags
};
