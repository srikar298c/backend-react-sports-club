import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { userService } from '../services'; // Corrected to userService
import { tokenService } from '../services'; // Assuming tokenService is exported
import { TokenTypes } from '../config/token'; // Ensure TokenTypes is properly exported
import { User } from '../models';
import { toJSON } from '../models/plugins';

/**
 * Authenticate a user by email and password
 */
const loginWithEmailAndPassword = async (email: string, password: string) => {
  // Fetch the user by email
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  // Ensure password is present before comparing
  if (!user.password) {
    throw new ApiError('Password not set for this user', httpStatus.BAD_REQUEST);
  }

  // Validate the password using the `isPasswordMatch` utility
  const isPasswordValid = await User.isPasswordMatch(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  return toJSON(user);
};



/**
 * Logout user by blacklisting the refresh token
 */
const logout = async (refreshToken: string) => {
  try {
    const tokenDoc = await tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);
    if (!tokenDoc) {
      throw new ApiError('Token not found', httpStatus.NOT_FOUND);
    }

    // Blacklist the refresh token
    await tokenService.blacklistToken((tokenDoc.id)); // Ensure token ID is passed as a string
  } catch (error) {
    throw new ApiError('Error blacklisting token', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Refresh access token
 */
const refreshAuth = async (refreshToken: string) => {
  try {
    // Verify the refresh token
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);

    // Pass the userId as a number, no need to cast to string
    const user = await userService.getUserById(refreshTokenDoc.userId);  // Directly pass as number

    if (!user) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }

    // Generate new authentication tokens
    return tokenService.generateAuthTokens({ id: user.id,
  role: user.role || 'user',});
  } catch (error) {
    throw new ApiError('Invalid refresh token', httpStatus.UNAUTHORIZED);
  }
};

/**
 * Reset password using a token
 */
const resetPassword = async (resetToken: string, newPassword: string) => {
  try {
    const resetTokenDoc = await tokenService.verifyToken(resetToken, TokenTypes.RESET_PASSWORD);

    const user = await userService.getUserById(resetTokenDoc.userId);

    if (!user) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10); 

    await userService.updateUser(user.id, { password: hashedPassword });

    await tokenService.blacklistToken((resetTokenDoc.id));
    // Blacklist the reset token
  } catch (error) {
    throw new ApiError('Error resetting password', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Verify email using a token
 */
const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.userId);

    if (!user) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }

    // Mark email as verified
    await userService.updateUser(user.id, { isEmailVerified: true });
    await tokenService.blacklistToken((verifyEmailTokenDoc.id)); // Blacklist the verification token
  } catch (error) {
    throw new ApiError('Error verifying email', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const authService = {
  loginWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
