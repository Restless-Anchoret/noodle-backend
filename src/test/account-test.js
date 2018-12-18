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
        it('should update account name successfully', async () => {
            const requestBody = { name: 'New name' };
            const { body } = await putRequest('/account', requestBody);

            expect(body.id).to.be.a('number');
            expect(body.login).to.equal(defaultAccount.login);
            expect(body.name).to.equal(requestBody.name);
            await verifySignIn(defaultAccount.password, requestBody.name);
        });

        it('should update account password successfully', async () => {
            const requestBody = {
                oldPassword: defaultAccount.password,
                newPassword: defaultAccount.password + '456'
            };
            const { body } = await putRequest('/account', requestBody);

            expect(body.id).to.be.a('number');
            expect(body.login).to.equal(defaultAccount.login);
            expect(body.name).to.equal(defaultAccount.name);
            await verifySignIn(requestBody.newPassword, defaultAccount.name);
        });

        it('should fail when old password is incorrect', async () => {
            const requestBody = {
                oldPassword: defaultAccount.password + '789',
                newPassword: defaultAccount.password + '456'
            };
            await putRequest('/account', requestBody, 403, 5);
        });

        async function verifySignIn (password, name) {
            const requestBody = {
                login: defaultAccount.login,
                password: password
            };
            const { body } = await postRequest('/account/sign-in', requestBody, 200, null, null);
            expect(body.account.name).to.equal(name);
        }
    });

    describe('Sign in end point testing', () => {
        it('should sign in successfully when account exists', async () => {
            const requestBody = {
                login: defaultAccount.login,
                password: defaultAccount.password
            };
            const { body } = await postRequest('/account/sign-in', requestBody, 200, null, null);

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
            await postRequest('/account/sign-in', requestBody, 401, 4, null);
        });

        it('should fail when login does not exist', async () => {
            const requestBody = {
                login: defaultAccount.login + '-suffix',
                password: defaultAccount.password
            };
            await postRequest('/account/sign-in', requestBody, 401, 4, null);
        });
    });
});
