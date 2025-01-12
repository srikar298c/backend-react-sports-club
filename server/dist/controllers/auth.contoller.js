"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Assuming catchAsync is a utility for async error handling
const services_1 = require("../services"); // Prisma services
/**
 * Register a new user
 */
const register = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.createUser(req.body); // Create a new user
    const tokens = await services_1.tokenService.generateAuthTokens({ id: user.id,
        role: user.role || 'user', }); // Generate tokens
    res.setHeader('Authorization', `Bearer ${tokens.access.token}`);
    res.cookie('refreshToken', tokens.refresh.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: tokens.refresh.expires,
    });
    res.status(http_status_1.default.CREATED).send({ user });
});
/**
 * Login a user with email and password
 */
const login = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    // Authenticate user
    const user = await services_1.authService.loginWithEmailAndPassword(email, password);
    // Generate tokens
    const tokens = await services_1.tokenService.generateAuthTokens({ id: user.id,
        role: user.role || 'user', });
    // Set cookies
    res.setHeader('Authorization', `Bearer ${tokens.access.token}`);
    ;
    res.cookie('refreshToken', tokens.refresh.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: tokens.refresh.expires, // Expiration for refresh token
    });
    res.status(http_status_1.default.OK).send({ user });
});
/**
 * Logout user by blacklisting refresh token
 */
const logout = (0, catchAsync_1.default)(async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        res.status(http_status_1.default.BAD_REQUEST).send({ message: 'Authorization header is missing' });
        return;
    }
    // Extract accessToken from the Authorization header
    const accessToken = authorizationHeader.split(' ')[1]; // Extract token after "Bearer"
    if (!accessToken) {
        res.status(http_status_1.default.BAD_REQUEST).send({ message: 'Access token is missing' });
        return;
    }
    // Blacklist the refresh token (we'll still need it for logout functionality)
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(http_status_1.default.BAD_REQUEST).send({ message: 'Refresh token is missing' });
        return;
    }
    await services_1.authService.logout(refreshToken);
    // Clear the cookies
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(http_status_1.default.NO_CONTENT).send();
});
/**
 * Refresh authentication tokens (access and refresh tokens)
 */
const refreshTokens = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await services_1.authService.refreshAuth(refreshToken); // Generate new tokens
    // Set accessToken in Authorization header (Bearer token)
    res.setHeader('Authorization', `Bearer ${tokens.access.token}`);
    res.cookie('refreshToken', tokens.refresh.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: tokens.refresh.expires, // Expiration for refresh token
    });
    res.send({ ...tokens });
});
/**
 * Generate a password reset token and send email
 */
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    const resetPasswordToken = await services_1.tokenService.generateResetPasswordToken(email); // Generate reset token
    await services_1.emailService.sendResetPasswordEmail(email, resetPasswordToken); // Send reset email
    res.status(http_status_1.default.NO_CONTENT).send(); // No content after sending email
});
/**
 * Reset user's password using a token
 */
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { token } = req.query; // Token from query params
    const { password } = req.body; // New password from request body
    await services_1.authService.resetPassword(token, password); // Reset password using token
    res.status(http_status_1.default.NO_CONTENT).send(); // No content after successful reset
});
// const sendUserVerificationEmail = catchAsync(async (req: Request, res: Response) => {
//   // Ensure user exists and has an email
//   if (!req.user || !req.user.email) {
//     throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
//   }
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
//   // Send email to the user with the verification token
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
//   // No content response after sending the email
//   res.status(httpStatus.NO_CONTENT).send();
// });
/**
 * Verify email using the token
 */
const verifyEmail = (0, catchAsync_1.default)(async (req, res) => {
    const { token } = req.query; // Token from query params
    await services_1.authService.verifyEmail(token); // Verify email using the token
    res.status(http_status_1.default.NO_CONTENT).send(); // No content after successful verification
});
exports.authController = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail
};
