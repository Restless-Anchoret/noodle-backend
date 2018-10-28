'use strict';

const jwt = require('../util/jwt');
const { JwtTokenError } = require('../util/errors');
const loggerFactory = require('../util/logger-factory');

const log = loggerFactory.getLogger(__filename);

async function middleware (request, response, secured) {
    if (!secured) {
        return;
    }

    const header = request.headers.authorization;
    const token = retrieveToken(header);

    if (!token) {
        throw new JwtTokenError();
    }

    try {
        request.jwtPayload = await jwt.verify(token);
    } catch (err) {
        log.warn(err);
        throw new JwtTokenError();
    }
}

function retrieveToken (header) {
    if (header && header.startsWith('Bearer ')) {
        return header.slice(7);
    }
}

module.exports = middleware;
