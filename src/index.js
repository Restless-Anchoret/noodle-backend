'use strict';

const applicationStarter = require('./util/application-starter');
const loggerFactory = require('./util/logger-factory');

const log = loggerFactory.getLogger(__filename);

applicationStarter.startApplication()
    .then(() => log.info('Noodle started successfully'))
    .catch(err => log.error('Noodle initialization failed:', err));
