const accountController = require('./account-controller');
const versionController = require('./version-controller');

module.exports = {
    controllers: [
        accountController,
        versionController
        // todo: add other controllers
    ]
};
