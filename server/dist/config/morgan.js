"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.successHandler = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./logger")); // Import the custom winston logger
const config_1 = require("./config"); // Assuming the config file contains environment configurations
// Custom token to retrieve the error message from response locals
morgan_1.default.token('message', (req, res) => res.locals.errorMessage || '');
// Function to determine the IP format based on the environment
const getIpFormat = () => (config_1.config.env === 'production' ? ':remote-addr - ' : '');
// Define the success response format
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
// Define the error response format, including the message token
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
// Success handler middleware
const successHandler = (0, morgan_1.default)(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: {
        // Using an arrow function ensures the return type is void
        write: (message) => {
            logger_1.default.info(message.trim()); // Log the success message using winston's logger
        }
    },
});
exports.successHandler = successHandler;
// Error handler middleware
const errorHandler = (0, morgan_1.default)(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: {
        // Using an arrow function ensures the return type is void
        write: (message) => {
            logger_1.default.error(message.trim()); // Log the error message using winston's logger
        }
    },
});
exports.errorHandler = errorHandler;
