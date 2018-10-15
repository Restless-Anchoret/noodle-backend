const { RestApiError, RestApi4xxError } = require('../util/errors');
const loggerFactory = require('../util/logger-factory');

const log = loggerFactory.getLogger(__filename);

function middleware(request, response, error) {
    if (!(error instanceof RestApiError)) {
        log.error('Unknown error', error);
        response.status(500);
        return;
    }

    log.warn('Handled REST API error:', error);
    response.status(error.httpCode);

    if (error instanceof RestApi4xxError) {
        response.json({
            code: error.errorCode,
            message: error.message
        });
    } else {
        response.send();
    }
}

module.exports = middleware;
