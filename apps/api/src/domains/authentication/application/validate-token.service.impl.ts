import * as jwt from 'jsonwebtoken';

import { ApplicationException } from '@/shared';

import { IValidateTokenService } from '../interfaces';

export class ValidateTokenServiceImpl implements IValidateTokenService {
  constructor(private readonly jwtSecret: string) {
    if (!this.jwtSecret) {
      throw ApplicationException.parameterNotFound(
        'token validate secret',
        'Invalid server configuration',
      );
    }
  }

  async execute(token: string): Promise<void> {
    try {
      if (!token) {
        throw ApplicationException.invalidParameter(
          'token',
          'Token is required for validation',
        );
      }

      // Verify the token with proper validation
      jwt.verify(token, this.jwtSecret, {
        issuer: 'driveapp-api',
        audience: 'driveapp-users',
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApplicationException.invalidParameter(
          'token',
          'JWT token verification failed',
        ).previousError(error as Error);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw ApplicationException.expiredToken();
      }
      if (error instanceof jwt.NotBeforeError) {
        throw ApplicationException.invalidParameter(
          'token',
          'JWT token is not yet valid',
        ).previousError(error as Error);
      }

      // Re-throw ApplicationException instances
      if (error instanceof ApplicationException) {
        throw error;
      }

      // Handle other errors
      throw ApplicationException.invalidParameter(
        'token',
        'JWT token verification failed',
      ).previousError(error as Error);
    }
  }
}
