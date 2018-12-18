'use strict';

const chai = require('chai');
const expect = chai.expect;
const { getRequest, postRequest, putRequest, defaultAccount } = require('./test-util');

describe('Account REST API testing', () => {
    describe('Get account end point testing', () => {
        // todo
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
            const result = await postRequest('/account/sign-in', requestBody, null);

            expect(result.body.token).to.be.a('string');
            expect(result.body.account.id).to.be.a('number');
            expect(result.body.account.login).to.equal(defaultAccount.login);
            expect(result.body.account.name).to.equal(defaultAccount.name);
        });
    });
});
