import type { Request, Response, NextFunction } from 'express';

/**
 * Error handling middleware
 * Catches all errors and formats them for consistent API responses
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      error: {
        message: error.message,
        code: error.code,
        status: error.status,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Default to 500 for unexpected errors
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      status: 500,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Catch async errors in route handlers
 * Wraps async functions to catch thrown errors and pass to error handler
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
