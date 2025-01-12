"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../config/config");
const services_1 = require("../services");
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const token_1 = require("../config/token");
const generateToken = (userId, expires, type, role, secret = config_1.config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
        role,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
const saveToken = async (token, userId, expires, type, role, blacklisted = false) => {
    return await models_1.TokenModel.createToken({
        userId: Number(userId),
        token,
        type,
        expires: expires.toDate(),
        blacklisted,
        role,
    });
};
const verifyToken = async (token, type, requiredRole) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        const tokenDoc = await models_1.TokenModel.getTokenByUserAndType(Number(payload.sub), type, requiredRole);
        if (!tokenDoc || tokenDoc.blacklisted) {
            throw new ApiError_1.default('Invalid or expired token', http_status_1.default.UNAUTHORIZED);
        }
        // Verify role if required
        if (requiredRole && tokenDoc.role !== requiredRole) {
            throw new ApiError_1.default('Insufficient permissions', http_status_1.default.FORBIDDEN);
        }
        // Fetch the user associated with the token
        const user = await services_1.userService.getUserById(tokenDoc.userId);
        if (!user) {
            throw new ApiError_1.default('User not found', http_status_1.default.UNAUTHORIZED);
        }
        return tokenDoc;
    }
    catch (error) {
        throw new ApiError_1.default('Invalid or expired token', http_status_1.default.UNAUTHORIZED);
    }
};
const generateAuthTokens = async (user) => {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.accessExpirationMinutes, 'minutes');
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.config.jwt.refreshExpirationDays, 'days');
    const userId = String(user.id);
    const accessToken = generateToken(userId, accessTokenExpires, token_1.TokenTypes.ACCESS, user.role);
    const refreshToken = generateToken(userId, refreshTokenExpires, token_1.TokenTypes.REFRESH, user.role);
    await saveToken(refreshToken, userId, refreshTokenExpires, token_1.TokenTypes.REFRESH, user.role);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
const generateResetPasswordToken = async (email) => {
    const user = await services_1.userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default('No user found with this email', http_status_1.default.NOT_FOUND);
    }
    const role = user.role ?? 'user';
    const expires = (0, moment_1.default)().add(config_1.config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(String(user.id), expires, token_1.TokenTypes.RESET_PASSWORD, role);
    await saveToken(resetPasswordToken, String(user.id), expires, token_1.TokenTypes.RESET_PASSWORD, role);
    return resetPasswordToken;
};
const generateVerifyEmailToken = async (user) => {
    const expires = (0, moment_1.default)().add(config_1.config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, token_1.TokenTypes.VERIFY_EMAIL, user.role);
    await saveToken(verifyEmailToken, user.id, expires, token_1.TokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};
const generateJwtToken = (user) => {
    const payload = {
        sub: user.id, // 'sub' is typically used for the user ID
        name: user.name, // Optional: other user information you may want to include in the token
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, {
        expiresIn: config_1.config.jwt.accessExpirationMinutes * 60, // Expiry time for the access token
    });
};
exports.tokenService = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
    blacklistToken: models_1.TokenModel.blacklistToken,
    generateJwtToken
};
