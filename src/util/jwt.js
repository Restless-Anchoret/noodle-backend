'use strict';

const jwt = require('jsonwebtoken');
const appContext = require('./application-context');

function sign (payload) {
    const secret = appContext.config.jwt.secret;
    const expiresIn = appContext.config.jwt.expiresIn;

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {
            expiresIn: expiresIn
        }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function verify (token) {
    const secret = appContext.config.jwt.secret;

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

module.exports = {
    sign: sign,
    verify: verify
};
