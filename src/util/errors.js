class RestApiError {
    constructor(name, message, httpCode) {
        this.name = name;
        this.message = message;
        this.httpCode = httpCode;
    }
}

class RestApi4xxError extends RestApiError {
    constructor(name, message, httpCode, errorCode) {
        super(name, message, httpCode);
        this.errorCode = errorCode;
    }
}

class BadRequestError extends RestApi4xxError {
    constructor(name, message, errorCode) {
        super(name, message, 400, errorCode);
    }
}

class UnauthorizedError extends RestApi4xxError {
    constructor(name, message, errorCode) {
        super(name, message, 401, errorCode);
    }
}

class ForbiddenError extends RestApi4xxError {
    constructor(name, message, errorCode) {
        super(name, message, 403, errorCode);
    }
}

class NotFoundError extends RestApi4xxError {
    constructor(name, message, errorCode) {
        super(name, message, 404, errorCode);
    }
}

class InternalServerError extends RestApiError {
    constructor() {
        super('InternalServerError', 'Internal server error.', 500);
    }
}

class ValidationError extends BadRequestError {
    constructor() {
        super('ValidationError', 'Request validation error.', 1);
    }
}

class LoginAlreadyUsedError extends BadRequestError {
    constructor() {
        super('LoginAlreadyUsedError', 'Login is already used.', 2);
    }
}

class JwtTokenError extends RestApiError {
    constructor(message) {
        super('JwtTokenError', 'Required JWT token is absent, invalid or expired.', 3);
    }
}

class IncorrectLoginPasswordError extends RestApiError {
    constructor(message) {
        super('IncorrectLoginPasswordError', 'Incorrect login or password.', 3);
    }
}

class IncorrectOldPasswordError extends RestApiError {
    constructor(message) {
        super('IncorrectOldPasswordError', 'Incorrect old password.', 3);
    }
}

class ResourceNotFoundError extends RestApiError {
    constructor(message) {
        super('ResourceNotFoundError', 'Resource not found.', 3);
    }
}

module.exports = {
    RestApiError: RestApiError,
    RestApi4xxError: RestApi4xxError,
    BadRequestError: BadRequestError,
    UnauthorizedError: UnauthorizedError,
    ForbiddenError: ForbiddenError,
    NotFoundError: NotFoundError,
    InternalServerError: InternalServerError,
    ValidationError: ValidationError,
    LoginAlreadyUsedError: LoginAlreadyUsedError,
    JwtTokenError: JwtTokenError,
    IncorrectLoginPasswordError: IncorrectLoginPasswordError,
    IncorrectOldPasswordError: IncorrectOldPasswordError,
    ResourceNotFoundError: ResourceNotFoundError
};
