import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Format validation errors into a readable structure
 */
function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  function extractErrors(error: ValidationError, prefix = ''): void {
    const property = prefix ? `${prefix}.${error.property}` : error.property;

    if (error.constraints) {
      formatted[property] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => extractErrors(child, property));
    }
  }

  errors.forEach((error) => extractErrors(error));
  return formatted;
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  // Handle validation errors
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    res.status(400).json({
      error: 'Validation failed',
      details: formatValidationErrors(err),
    });
    return;
  }

  // Handle unexpected errors
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
}
