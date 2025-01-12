"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// Centralized error handling middleware
const globalErrorHandler = (err, req, res, next) => {
    let error = err;
    // Handle unexpected errors
    if (!(error instanceof ApiError_1.default)) {
        const message = process.env.NODE_ENV === 'development'
            ? error.message || "An unexpected error occurred"
            : "Something went wrong, please try again later.";
        error = new ApiError_1.default(message, http_status_1.default.INTERNAL_SERVER_ERROR);
    }
    // Log the error (use a proper logging system in production)
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
    }
    else {
        console.error('Error:', {
            message: error.message,
            stack: error.stack,
            statusCode: error.statusCode,
        });
    }
    // Respond to the client
    res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }), // Include stack trace in development
    });
};
exports.default = globalErrorHandler;
