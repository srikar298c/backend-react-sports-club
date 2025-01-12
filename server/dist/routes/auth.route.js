"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const validate_1 = require("../middlewares/validate"); // Assuming you have a validation middleware
const auth_validation_1 = require("../validations/auth.validation"); // Assuming you have validation schemas
const auth_1 = __importDefault(require("../middlewares/auth")); // Assuming you have an authentication middleware
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// Register route
router.post('/register', (0, validate_1.validateRequest)(auth_validation_1.authValidation.register), controllers_1.authController.register);
// Login route
router.post('/login', (0, validate_1.validateRequest)(auth_validation_1.authValidation.login), // Validate login input
controllers_1.authController.login);
// Logout route (requires authentication)
router.post('/logout/email', (0, auth_1.default)(), (0, validate_1.validateRequest)(auth_validation_1.authValidation.logout), // Validate logout input
controllers_1.authController.logout);
// Initiate Google OAuth
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
}), controllers_1.googleAuthController.handleGoogleAuth);
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), controllers_1.googleAuthController.handleGoogleAuth);
router.post('/logout/google', controllers_1.googleAuthController.logout);
router.post('/refresh-tokens', (0, validate_1.validateRequest)(auth_validation_1.authValidation.refreshTokens), // Validate refresh token input
controllers_1.authController.refreshTokens);
// Forgot password route
router.post('/forgot-password', (0, validate_1.validateRequest)(auth_validation_1.authValidation.forgotPassword), controllers_1.authController.forgotPassword);
// Reset password route
router.post('/reset-password', (0, validate_1.validateRequest)(auth_validation_1.authValidation.resetPassword), controllers_1.authController.resetPassword);
// Verify email route
router.get('/verify-email', (0, validate_1.validateRequest)(auth_validation_1.authValidation.verifyEmail), controllers_1.authController.verifyEmail);
// // Optional: Resend verification email route (if you want to add this functionality)
// router.post(
//   '/resend-verification-email', 
//   auth(), // Ensure user is authenticated
//   authController.sendUserVerificationEmail // Uncomment this method in your controller
// );
exports.default = router;
