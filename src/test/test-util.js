'use strict';

const supertestRequest = require('supertest');
const { app } = require('../util/routing-configurator');
const db = require('../util/db/db');
const accountDao = require('../dao/account-dao');
const jwt = require('../util/jwt');
const loggerFactory = require('../util/logger-factory');

const log = loggerFactory.getLogger(__filename);

const DEFAULT_ACCOUNT = {
    login: 'login',
    password: 'password123',
    name: 'Name'
};

async function request (method, url, body, login) {
    const jwtToken = await getJwtTokenForLogin(login);
    return preparePromise(method, url, body, jwtToken);
}

async function getJwtTokenForLogin (login) {
    if (login === null) {
        return null;
    }

    const actualLogin = login || DEFAULT_ACCOUNT.login;
    const account = accountDao.getAccountByLogin(db, actualLogin);

    if (!account) {
        log.warn('Account does not exist for login', actualLogin);
        return null;
    }

    return jwt.sign({ id: account.id });
}

function preparePromise (method, url, body, jwtToken) {
    let promise = supertestRequest(app)[method]('/api/v1' + url);

    if (body) {
        promise = promise.send(body);
    }

    if (jwtToken) {
        promise = promise.setHeader('Authorization', 'Bearer ' + jwtToken);
    }

    return promise;
}

async function getRequest (url, login) {
    return request('get', url, null, login);
}

async function postRequest (url, body, login) {
    return request('post', url, body, login);
}

async function putRequest (url, body, login) {
    return request('put', url, body, login);
}

async function deleteRequest (url, login) {
    return request('delete', url, null, login);
}

module.exports = {
    getRequest: getRequest,
    postRequest: postRequest,
    putRequest: putRequest,
    deleteRequest: deleteRequest,
    defaultAccount: DEFAULT_ACCOUNT
};
