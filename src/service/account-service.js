const bcrypt = require('bcrypt');
const jwt = require('../util/jwt');
const db = require('../util/db/db');
const accountDao = require('../dao/account-dao');

const SALT_ROUNDS = 10;

async function getAccount (context) {
    const accountId = context.jwtPayload.id;
    return accountDao.getAccountById(db, accountId);
}

async function registerAccount (context) {
    const dto = context.body;
    // todo: check if login is available first
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

    const token = await jwt.sign({ id: account.id });
    return {
        token: token,
        account: account
    };
}

async function updateAccount (context) {
    // todo
}

async function signIn (context) {
    // todo
}

module.exports = {
    getAccount: getAccount,
    registerAccount: registerAccount,
    updateAccount: updateAccount,
    signIn: signIn
};
