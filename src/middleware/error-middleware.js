const { RestApiError } = require('../util/errors');
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
    response.json({
        code: error.errorCode,
        message: error.message
    });
}

module.exports = middleware;
