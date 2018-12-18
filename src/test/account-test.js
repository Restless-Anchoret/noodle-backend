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
        it('should register account successfully', async () => {
            const requestBody = {
                login: 'new-login',
                password: 'new-password123',
                name: 'New Name'
            };
            const { body } = await postRequest('/account', requestBody, 201, null, null);

            expect(body.token).to.be.a('string');
            expect(body.account.id).to.be.a('number');
            expect(body.account.login).to.equal(requestBody.login);
            expect(body.account.name).to.equal(requestBody.name);
            await verifySignIn(requestBody.login, requestBody.password, requestBody.name);
        });

        it('should fail when login is already used', async () => {
            const requestBody = {
                login: defaultAccount.login,
                password: 'new-password123',
                name: 'New Name'
            };
            await postRequest('/account', requestBody, 400, 2, null);
        });

        it('should fail when password is weak', async () => {
            const requestBody = {
                login: 'new-login',
                password: 'new-password',
                name: 'New Name'
            };
            await postRequest('/account', requestBody, 400, 1, null);
        });
    });

    describe('Update account end point testing', () => {
        it('should update account name successfully', async () => {
            const requestBody = { name: 'New name' };
            const { body } = await putRequest('/account', requestBody);

            expect(body.id).to.be.a('number');
            expect(body.login).to.equal(defaultAccount.login);
            expect(body.name).to.equal(requestBody.name);
            await verifySignIn(defaultAccount.login, defaultAccount.password, requestBody.name);
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
            await verifySignIn(defaultAccount.login, requestBody.newPassword, defaultAccount.name);
        });

        it('should fail when old password is incorrect', async () => {
            const requestBody = {
                oldPassword: defaultAccount.password + '789',
                newPassword: defaultAccount.password + '456'
            };
            await putRequest('/account', requestBody, 403, 5);
        });

        it('should fail when new password is weak', async () => {
            const requestBody = {
                oldPassword: defaultAccount.password,
                newPassword: 'password'
            };
            await putRequest('/account', requestBody, 400, 1);
        });
    });

    describe('Sign in end point testing', () => {
        it('should sign in successfully when account exists', async () => {
            await verifySignIn(defaultAccount.login, defaultAccount.password, defaultAccount.name);
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

    async function verifySignIn (login, password, name) {
        const requestBody = {
            login: login,
            password: password
        };
        const { body } = await postRequest('/account/sign-in', requestBody, 200, null, null);

        expect(body.token).to.be.a('string');
        expect(body.account.id).to.be.a('number');
        expect(body.account.login).to.equal(login);
        expect(body.account.name).to.equal(name);
    }
});
