import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync is a utility for async error handling
import { authService, userService, tokenService, emailService } from '../services'; // Prisma services

/**
 * Register a new user
 */
const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body); // Create a new user
  const tokens = await tokenService.generateAuthTokens({ id: user.id,
  role: user.role || 'user',}); // Generate tokens

 
 res.setHeader('Authorization', `Bearer ${tokens.access.token}`);

  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: tokens.refresh.expires,
  });

  res.status(httpStatus.CREATED).send({ user });
});


/**
 * Login a user with email and password
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Authenticate user
  const user = await authService.loginWithEmailAndPassword(email, password);

  // Generate tokens
  const tokens = await tokenService.generateAuthTokens({ id: user.id,
  role: user.role || 'user',});

  // Set cookies
 res.setHeader('Authorization', `Bearer ${tokens.access.token}`);;

  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: tokens.refresh.expires, // Expiration for refresh token
  });

  res.status(httpStatus.OK).send({ user }); 
});

/**
 * Logout user by blacklisting refresh token
 */
const logout = catchAsync(async (req: Request, res: Response) => {
  const authorizationHeader = req.headers['authorization']; 

  if (!authorizationHeader) {
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Authorization header is missing' });
    return;
  }

  // Extract accessToken from the Authorization header
  const accessToken = authorizationHeader.split(' ')[1]; // Extract token after "Bearer"
  
  if (!accessToken) {
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Access token is missing' });
    return;
  }

  // Blacklist the refresh token (we'll still need it for logout functionality)
  const refreshToken = req.cookies.refreshToken; 
  if (!refreshToken) {
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Refresh token is missing' });
    return;
  }

  await authService.logout(refreshToken);

  // Clear the cookies
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(httpStatus.NO_CONTENT).send(); 
});


/**
 * Refresh authentication tokens (access and refresh tokens)
 */
const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken); // Generate new tokens
  
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
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email); // Generate reset token
  await emailService.sendResetPasswordEmail(email, resetPasswordToken); // Send reset email
  res.status(httpStatus.NO_CONTENT).send(); // No content after sending email
});

/**
 * Reset user's password using a token
 */
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query; // Token from query params
  const { password } = req.body; // New password from request body
  await authService.resetPassword(token as string, password); // Reset password using token
  res.status(httpStatus.NO_CONTENT).send(); // No content after successful reset
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
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query; // Token from query params
  await authService.verifyEmail(token as string); // Verify email using the token
  res.status(httpStatus.NO_CONTENT).send(); // No content after successful verification
});

export const authController= {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
};
