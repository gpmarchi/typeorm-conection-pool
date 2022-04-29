import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import { AppError } from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function authenticate(
  request: Request,
  _: Response,
  next: NextFunction,
): void {
  const authHeader = request.header('authorization');

  if (!authHeader) {
    throw new AppError('JWT token was not provided.', 401);
  }

  const [, token] = authHeader?.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.publicKey);

    const { sub } = decodedToken as ITokenPayload;

    request.user = { id: sub };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token provided.', 401);
  }
}
