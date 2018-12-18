'use strict';

const applicationStarter = require('../util/application-starter');
const routingConfigurator = require('../util/routing-configurator');
const migration = require('../util/migration');
const { env } = require('../schema/enum');

before(async () => {
    await applicationStarter.startApplication(env.test);
});

after(async () => {
    await routingConfigurator.closeServer();
});

beforeEach(async () => {
    await migration.up();
});

afterEach(async () => {
    await migration.reset();
});
