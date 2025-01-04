import express from 'express';
import { authController, googleAuthController } from '../controllers';
import { validateRequest} from '../middlewares/validate'; // Assuming you have a validation middleware
import { authValidation } from '../validations/auth.validation'; // Assuming you have validation schemas
import auth from '../middlewares/auth'; // Assuming you have an authentication middleware
import passport from 'passport';

const router = express.Router();

// Register route
router.post(
  '/register', 
  validateRequest(authValidation.register), 
  authController.register
);

// Login route
router.post(
  '/login', 
  validateRequest(authValidation.login), // Validate login input
  authController.login
);

// Logout route (requires authentication)
router.post(
  '/logout/email', 
  auth(), 
  validateRequest(authValidation.logout), // Validate logout input
  authController.logout
);
// Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),googleAuthController.handleGoogleAuth
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthController.handleGoogleAuth
);

router.post('/logout/google', googleAuthController.logout);


router.post(
  '/refresh-tokens', 
  validateRequest(authValidation.refreshTokens), // Validate refresh token input
  authController.refreshTokens
);

// Forgot password route
router.post(
  '/forgot-password', 
  validateRequest(authValidation.forgotPassword), 
  authController.forgotPassword
);

// Reset password route
router.post(
  '/reset-password', 
  validateRequest(authValidation.resetPassword), 
  authController.resetPassword
);

// Verify email route
router.get(
  '/verify-email', 
  validateRequest(authValidation.verifyEmail), 
  authController.verifyEmail
);

// // Optional: Resend verification email route (if you want to add this functionality)
// router.post(
//   '/resend-verification-email', 
//   auth(), // Ensure user is authenticated
//   authController.sendUserVerificationEmail // Uncomment this method in your controller
// );

export default router;