'use strict';

const applicationStarter = require('../util/application-starter');
const routingConfigurator = require('../util/routing-configurator');
const migration = require('../util/migration');
const { env } = require('../schema/enum');
const accountService = require('../service/account-service');
const { defaultAccount } = require('./test-util');

before(async () => {
    await applicationStarter.startApplication(env.test);
});

after(async () => {
    await routingConfigurator.closeServer();
});

beforeEach(async () => {
    await migration.up();

    const registerBody = {
        login: defaultAccount.login,
        password: defaultAccount.password,
        name: defaultAccount.name
    };
    await accountService.registerAccount({ body: registerBody });
});

afterEach(async () => {
    await migration.reset();
});
