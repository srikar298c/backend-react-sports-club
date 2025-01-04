"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// Centralized error handling middleware
const globalErrorHandler = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.default)) {
        // If error is not an instance of ApiError, create a generic internal server error
        error = new ApiError_1.default(error.message || 'Internal Server Error', 500);
    }
    // Log the error (you can add a logging mechanism here)
    console.error(error.stack);
    // Respond to the client
    res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }), // Show stack trace in development
    });
};
exports.default = globalErrorHandler;
