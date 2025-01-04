import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

// Centralized error handling middleware
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // Handle unexpected errors
  if (!(error instanceof ApiError)) {
    const message = process.env.NODE_ENV === 'development'
      ? error.message || "An unexpected error occurred"
      : "Something went wrong, please try again later.";
    error = new ApiError(message, httpStatus.INTERNAL_SERVER_ERROR);
  }

  // Log the error (use a proper logging system in production)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  } else {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
    });
  }

  // Respond to the client
  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }), // Include stack trace in development
  });
};

export default globalErrorHandler;
