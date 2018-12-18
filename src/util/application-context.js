'use strict';

function isEnv () {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] === module.exports.config.env) {
            return true;
        }
    }
    return false;
}

module.exports = {
    config: {},
    isEnv: isEnv
};
