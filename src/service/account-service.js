'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('../util/jwt');
const db = require('../util/db/db');
const accountDao = require('../dao/account-dao');
const _ = require('lodash');
const {
    LoginAlreadyUsedError,
    IncorrectLoginPasswordError,
    IncorrectOldPasswordError
} = require('../util/errors');

const SALT_ROUNDS = 10;

async function getAccount (context) {
    const accountId = context.jwtPayload.id;
    const account = await accountDao.getAccountById(db, accountId);
    return mapAccount(account);
}

async function registerAccount (context) {
    const dto = context.body;

    const alreadyExistingAccount = await accountDao.getAccountByLogin(db, dto.login);
    if (alreadyExistingAccount) {
        throw new LoginAlreadyUsedError();
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const account = {
        login: dto.login,
        passwordHash: passwordHash,
        name: dto.name,
        lastLoginDate: now,
        registrationDate: now
    };
    await accountDao.insertAccount(db, account);

    return getTokenWithAccount(account);
}

async function updateAccount (context) {
    const dto = context.body;
    const accountId = context.jwtPayload.id;

    if (!dto.name && !dto.newPassword) {
        return findAndMapAccount(accountId);
    }

    const account = await accountDao.getAccountById(db, accountId);
    const name = dto.name;
    let passwordHash;

    if (dto.newPassword) {
        const hashMatch = await bcrypt.compare(dto.oldPassword, account.passwordHash);
        if (!hashMatch) {
            throw new IncorrectOldPasswordError();
        }

        passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    }

    await accountDao.updateAccount(db, accountId, name, passwordHash);
    return findAndMapAccount(accountId);
}

async function findAndMapAccount (id) {
    const account = await accountDao.getAccountById(db, id);
    return mapAccount(account);
}

async function signIn (context) {
    const dto = context.body;

    const account = await accountDao.getAccountByLogin(db, dto.login);
    if (!account) {
        throw new IncorrectLoginPasswordError();
    }

    const hashMatch = await bcrypt.compare(dto.password, account.passwordHash);
    if (!hashMatch) {
        throw new IncorrectLoginPasswordError();
    }

    return getTokenWithAccount(account);
}

async function getTokenWithAccount (account) {
    const token = await jwt.sign({ id: account.id });
    return {
        token: token,
        account: mapAccount(account)
    };
}

function mapAccount (account) {
    const mappedAccount = _.clone(account);
    mappedAccount.passwordHash = undefined;
    return mappedAccount;
}

module.exports = {
    getAccount: getAccount,
    registerAccount: registerAccount,
    updateAccount: updateAccount,
    signIn: signIn
};
