const log4js = require('log4js');
const path = require('path');

const rootPath = process.cwd() + '/src';

function configureFactory() {
    // todo: configure logging to file
    log4js.getLogger().level = process.env['LOGGER_LEVEL'] || 'debug';
}

function getLogger(filename) {
    const loggerName = path.relative(rootPath, filename);
    return log4js.getLogger(loggerName);
}

module.exports = {
    configure: configureFactory,
    getLogger: getLogger
};
