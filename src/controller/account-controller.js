const jwt = require('../util/jwt');

async function getAccount(context) {
    // todo
}

async function registerAccount(context) {
    // todo

    const account = {
        id: 10,
        login: 'login',
        name: 'name'
    };
    const token = await jwt.sign({ id: account.id });

    return {
        token: token,
        account: account
    };
}

async function updateAccount(context) {
    // todo
}

async function signIn(context) {
    // todo
}

const controller = {
    url: '/account',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: {}, // todo: add schema
            handler: getAccount
        },
        {
            url: '',
            method: 'post',
            version: 1,
            validationSchema: {}, // todo: add schema
            handler: registerAccount
        },
        {
            url: '',
            method: 'put',
            version: 1,
            secured: true,
            validationSchema: {}, // todo: add schema
            handler: updateAccount
        },
        {
            url: '/sign-in',
            method: 'post',
            version: 1,
            validationSchema: {}, // todo: add schema
            handler: signIn
        }
    ]
};

module.exports = controller;
