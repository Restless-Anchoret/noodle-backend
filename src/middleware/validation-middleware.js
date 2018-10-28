'use strict';

const joi = require('joi');
const { ValidationError } = require('../util/errors');
const loggerFactory = require('../util/logger-factory');

const log = loggerFactory.getLogger(__filename);

function middleware (request, response, validationSchema) {
    if (!validationSchema) {
        return;
    }

    if (validationSchema.body) {
        validate(request.body, validationSchema.body);
    }

    if (validationSchema.query) {
        validate(request.query, validationSchema.query);
    }

    if (validationSchema.params) {
        validate(request.params, validationSchema.params);
    }
}

function validate (object, schema) {
    const validationResult = joi.validate(object, schema);
    if (validationResult.error) {
        log.debug(validationResult.error);
        throw new ValidationError();
    }
}

module.exports = middleware;
