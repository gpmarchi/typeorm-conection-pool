import { CelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

import { AppError } from '@shared/errors/AppError';

export default function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof CelebrateError) {
    const message = error.details.get('body')?.message;

    return response.status(400).json({
      status: 'error',
      message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
