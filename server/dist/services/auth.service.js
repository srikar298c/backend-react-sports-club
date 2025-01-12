"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const services_1 = require("../services"); // Corrected to userService
const services_2 = require("../services"); // Assuming tokenService is exported
const token_1 = require("../config/token"); // Ensure TokenTypes is properly exported
const models_1 = require("../models");
const plugins_1 = require("../models/plugins");
/**
 * Authenticate a user by email and password
 */
const loginWithEmailAndPassword = async (email, password) => {
    // Fetch the user by email
    const user = await services_1.userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default('Invalid email or password', http_status_1.default.UNAUTHORIZED);
    }
    // Ensure password is present before comparing
    if (!user.password) {
        throw new ApiError_1.default('Password not set for this user', http_status_1.default.BAD_REQUEST);
    }
    // Validate the password using the `isPasswordMatch` utility
    const isPasswordValid = await models_1.User.isPasswordMatch(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default('Invalid email or password', http_status_1.default.UNAUTHORIZED);
    }
    return (0, plugins_1.toJSON)(user);
};
/**
 * Logout user by blacklisting the refresh token
 */
const logout = async (refreshToken) => {
    try {
        const tokenDoc = await services_2.tokenService.verifyToken(refreshToken, token_1.TokenTypes.REFRESH);
        if (!tokenDoc) {
            throw new ApiError_1.default('Token not found', http_status_1.default.NOT_FOUND);
        }
        // Blacklist the refresh token
        await services_2.tokenService.blacklistToken((tokenDoc.id)); // Ensure token ID is passed as a string
    }
    catch (error) {
        throw new ApiError_1.default('Error blacklisting token', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
/**
 * Refresh access token
 */
const refreshAuth = async (refreshToken) => {
    try {
        // Verify the refresh token
        const refreshTokenDoc = await services_2.tokenService.verifyToken(refreshToken, token_1.TokenTypes.REFRESH);
        // Pass the userId as a number, no need to cast to string
        const user = await services_1.userService.getUserById(refreshTokenDoc.userId); // Directly pass as number
        if (!user) {
            throw new ApiError_1.default('User not found', http_status_1.default.UNAUTHORIZED);
        }
        // Generate new authentication tokens
        return services_2.tokenService.generateAuthTokens({ id: user.id });
    }
    catch (error) {
        throw new ApiError_1.default('Invalid refresh token', http_status_1.default.UNAUTHORIZED);
    }
};
/**
 * Reset password using a token
 */
const resetPassword = async (resetToken, newPassword) => {
    try {
        const resetTokenDoc = await services_2.tokenService.verifyToken(resetToken, token_1.TokenTypes.RESET_PASSWORD);
        const user = await services_1.userService.getUserById(resetTokenDoc.userId);
        if (!user) {
            throw new ApiError_1.default('User not found', http_status_1.default.UNAUTHORIZED);
        }
        // Hash the new password before saving
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await services_1.userService.updateUser(user.id, { password: hashedPassword });
        await services_2.tokenService.blacklistToken((resetTokenDoc.id));
        // Blacklist the reset token
    }
    catch (error) {
        throw new ApiError_1.default('Error resetting password', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
/**
 * Verify email using a token
 */
const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await services_2.tokenService.verifyToken(verifyEmailToken, token_1.TokenTypes.VERIFY_EMAIL);
        const user = await services_1.userService.getUserById(verifyEmailTokenDoc.userId);
        if (!user) {
            throw new ApiError_1.default('User not found', http_status_1.default.UNAUTHORIZED);
        }
        // Mark email as verified
        await services_1.userService.updateUser(user.id, { isEmailVerified: true });
        await services_2.tokenService.blacklistToken((verifyEmailTokenDoc.id)); // Blacklist the verification token
    }
    catch (error) {
        throw new ApiError_1.default('Error verifying email', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.authService = {
    loginWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
};
