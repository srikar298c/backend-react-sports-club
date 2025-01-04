"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    statusCode;
    isOperational;
    cause;
    errorCode;
    /**
     * Constructs an instance of ApiError.
     * @param {string} message - Error message
     * @param {number} [statusCode=500] - HTTP status code (default: 500)
     * @param {Error | undefined} cause - Underlying error (optional)
     * @param {string | undefined} errorCode - Optional error code for categorization
     */
    constructor(message, statusCode = 500, cause, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes operational vs. programming errors
        this.cause = cause;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Converts the error to a JSON-friendly format.
     * @returns {object}
     */
    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            stack: this.stack, // Optionally include stack traces for debugging
            cause: this.cause ? this.cause.message : undefined, // Include underlying error
        };
    }
}
exports.default = ApiError;
