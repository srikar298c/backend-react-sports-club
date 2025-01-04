import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';
import logger from './logger';  // Import the custom winston logger
import { config } from './config'; // Assuming the config file contains environment configurations

// Custom token to retrieve the error message from response locals
morgan.token('message', (req: Request, res: Response): string => res.locals.errorMessage || '');

// Function to determine the IP format based on the environment
const getIpFormat = (): string => (config.env === 'production' ? ':remote-addr - ' : '');

// Define the success response format
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

// Define the error response format, including the message token
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// Success handler middleware
const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response): boolean => res.statusCode >= 400,
  stream: {
    // Using an arrow function ensures the return type is void
    write: (message: string): void => {
      logger.info(message.trim());  // Log the success message using winston's logger
    }
  } as StreamOptions,
});

// Error handler middleware
const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response): boolean => res.statusCode < 400,
  stream: {
    // Using an arrow function ensures the return type is void
    write: (message: string): void => {
      logger.error(message.trim());  // Log the error message using winston's logger
    }
  } as StreamOptions,
});

export { successHandler, errorHandler };
