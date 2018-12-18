'use strict';

const chai = require('chai');
const supertestRequest = require('supertest');
const { app } = require('../util/routing-configurator');
const db = require('../util/db/db');
const accountDao = require('../dao/account-dao');
const jwt = require('../util/jwt');
const loggerFactory = require('../util/logger-factory');

const log = loggerFactory.getLogger(__filename);
const expect = chai.expect;

const DEFAULT_ACCOUNT = {
    login: 'login',
    password: 'password123',
    name: 'Name'
};

async function request (method, url, body, login, expectedStatusCode, expectedErrorCode) {
    const jwtToken = await getJwtTokenForLogin(login);
    const requestResult = await preparePromise(method, url, body, jwtToken);
    verifyCodes(requestResult, expectedStatusCode, expectedErrorCode);
    return requestResult;
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

function verifyCodes (result, expectedStatusCode, expectedErrorCode) {
    const actualExpectedStatusCode = expectedStatusCode || 200;
    expect(result.statusCode).to.equal(actualExpectedStatusCode);

    if (actualExpectedStatusCode < 400) {
        return;
    }

    expect(result.body.code).to.equal(expectedErrorCode);
    expect(result.body.message).to.be.a('string');
}

async function getRequest (url, login, expectedStatusCode, expectedErrorCode) {
    return request('get', url, null, login, expectedStatusCode, expectedErrorCode);
}

async function postRequest (url, body, login, expectedStatusCode, expectedErrorCode) {
    return request('post', url, body, login, expectedStatusCode, expectedErrorCode);
}

async function putRequest (url, body, login, expectedStatusCode, expectedErrorCode) {
    return request('put', url, body, login, expectedStatusCode, expectedErrorCode);
}

async function deleteRequest (url, login, expectedStatusCode, expectedErrorCode) {
    return request('delete', url, null, login, expectedStatusCode, expectedErrorCode);
}

module.exports = {
    getRequest: getRequest,
    postRequest: postRequest,
    putRequest: putRequest,
    deleteRequest: deleteRequest,
    defaultAccount: DEFAULT_ACCOUNT
};
