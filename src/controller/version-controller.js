const versionService = require('../service/version-service');

const controller = {
    url: '/version',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            handler: versionService.getVersion
        }
    ]
};

module.exports = controller;
