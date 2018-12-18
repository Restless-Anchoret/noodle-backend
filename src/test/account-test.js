'use strict';

const chai = require('chai');
const expect = chai.expect;
const { getRequest, postRequest, putRequest, defaultAccount } = require('./test-util');

describe('Account REST API testing', () => {
    describe('Get account end point testing', () => {
        it('should get currently authenticated account', async () => {
            const { body } = await getRequest('/account');

            expect(body.id).to.be.a('number');
            expect(body.login).to.equal(defaultAccount.login);
            expect(body.name).to.equal(defaultAccount.name);
        });
    });

    describe('Register account end point testing', () => {
        // todo
    });

    describe('Update account end point testing', () => {
        // todo
    });

    describe('Sign in end point testing', () => {
        it('should sign in successfully when account exists', async () => {
            const requestBody = {
                login: defaultAccount.login,
                password: defaultAccount.password
            };
            const { body } = await postRequest('/account/sign-in', requestBody, null);

            expect(body.token).to.be.a('string');
            expect(body.account.id).to.be.a('number');
            expect(body.account.login).to.equal(defaultAccount.login);
            expect(body.account.name).to.equal(defaultAccount.name);
        });

        it('should fail when password is incorrect', async () => {
            const requestBody = {
                login: defaultAccount.login,
                password: defaultAccount.password + '456'
            };
            await postRequest('/account/sign-in', requestBody, null, 401, 4);
        });

        it('should fail when login does not exist', async () => {
            const requestBody = {
                login: defaultAccount.login + '-suffix',
                password: defaultAccount.password
            };
            await postRequest('/account/sign-in', requestBody, null, 401, 4);
        });
    });
});
