const packageJson = require('../../package');

async function getVersion () {
    return {
        version: packageJson.version
    };
}

module.exports = {
    getVersion: getVersion
};
