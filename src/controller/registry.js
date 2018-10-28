'use strict';

const accountController = require('./account-controller');
const listController = require('./list-controller');
const taskController = require('./task-controller');
const tagController = require('./tag-controller');
const versionController = require('./version-controller');

module.exports = {
    controllers: [
        accountController,
        listController,
        taskController,
        tagController,
        versionController
    ]
};
