'use strict';

const accountService = require('../service/account-service');
const schema = require('../schema/account-schema');

const controller = {
    url: '/account',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            handler: accountService.getAccount
        },
        {
            url: '',
            method: 'post',
            version: 1,
            validationSchema: schema.postAccountSchema,
            successStatus: 201,
            handler: accountService.registerAccount
        },
        {
            url: '',
            method: 'put',
            version: 1,
            secured: true,
            validationSchema: schema.putAccountSchema,
            handler: accountService.updateAccount
        },
        {
            url: '/sign-in',
            method: 'post',
            version: 1,
            validationSchema: schema.signInSchema,
            handler: accountService.signIn
        }
    ]
};

module.exports = controller;
