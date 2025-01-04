class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public cause?: Error;
  public errorCode?: string;

  /**
   * Constructs an instance of ApiError.
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code (default: 500)
   * @param {Error | undefined} cause - Underlying error (optional)
   * @param {string | undefined} errorCode - Optional error code for categorization
   */
  constructor(
    message: string,
    statusCode: number,
    cause?: Error,
    errorCode?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational vs. programming errors
    this.cause = cause;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error to a JSON-friendly format.
   * @returns {object}
   */
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      stack: this.stack, // Optionally include stack traces for debugging
      cause: this.cause ? this.cause.message : undefined, // Include underlying error
    };
  }
}

export default ApiError;
