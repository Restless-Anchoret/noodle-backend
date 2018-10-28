'use strict';

const tagService = require('../service/tag-service');

const controller = {
    url: '/tags',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            handler: tagService.getTags
        }
    ]
};

module.exports = controller;
