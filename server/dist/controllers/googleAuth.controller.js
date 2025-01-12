"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../utils/ApiError")); // Custom error handling
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Wrapper for async functions
const services_1 = require("../services");
const handleGoogleAuth = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError_1.default('Authentication failed', http_status_1.default.UNAUTHORIZED);
    }
    // Set the JWT or session token as a cookie
    const token = services_1.tokenService.generateJwtToken(user); // You should implement this to generate a JWT
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ensure secure cookie in production
        sameSite: 'strict',
    });
    res.status(http_status_1.default.OK).json({
        message: 'Login successful',
    });
});
const logout = (0, catchAsync_1.default)(async (req, res) => {
    req.logout((err) => {
        if (err) {
            throw new ApiError_1.default('Logout failed', http_status_1.default.INTERNAL_SERVER_ERROR);
        }
        // Clear the cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(http_status_1.default.OK).json({
            message: 'Logout successful',
        });
    });
});
exports.googleAuthController = {
    handleGoogleAuth,
    logout
};
