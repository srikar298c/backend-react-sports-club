import { Request, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from '../utils/ApiError'; // Custom error handling
import catchAsync from '../utils/catchAsync'; // Wrapper for async functions
import {tokenService} from '../services'
const handleGoogleAuth = catchAsync(async (req: Request, res: Response) => {
  const user = req.user; 
  if (!user) {
      throw new ApiError('Authentication failed', httpStatus.UNAUTHORIZED);
  }

  // Set the JWT or session token as a cookie
  const token = tokenService.generateJwtToken(user); // You should implement this to generate a JWT
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ensure secure cookie in production
    sameSite: 'strict',
  });

  res.status(httpStatus.OK).json({
    message: 'Login successful',
  });
});

 const logout = catchAsync(async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      throw new ApiError('Logout failed', httpStatus.INTERNAL_SERVER_ERROR);
    }

    // Clear the cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
    });

    res.status(httpStatus.OK).json({
      message: 'Logout successful',
    });
  });
});


export const googleAuthController={
    handleGoogleAuth,
    logout
}