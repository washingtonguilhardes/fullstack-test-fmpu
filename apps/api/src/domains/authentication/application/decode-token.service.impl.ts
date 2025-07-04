import * as jwt from 'jsonwebtoken';

import { ApplicationException } from '@/shared';

import { TokenImpl } from '../domain';
import { IDecodeTokenService, Token } from '../interfaces';

export class DecodeTokenServiceImpl implements IDecodeTokenService {
  constructor(private readonly jwtSecret: string) {
    if (!this.jwtSecret) {
      throw ApplicationException.parameterNotFound(
        'token decode secret',
        'Invalid server configuration',
      );
    }
  }

  async execute(token: string): Promise<Token> {
    try {
      if (!token) {
        throw ApplicationException.invalidParameter(
          'token',
          'Token is required for decoding',
        );
      }

      const decoded = jwt.decode(token);

      if (!decoded || typeof decoded !== 'object') {
        throw ApplicationException.invalidParameter(
          'token',
          'Invalid token format for decoding',
        );
      }

      return new TokenImpl(token);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApplicationException.invalidParameter(
          'token',
          'JWT token decoding failed',
        ).previousError(error as Error);
      }

      // Re-throw ApplicationException instances
      if (error instanceof ApplicationException) {
        throw error;
      }

      // Handle other errors
      throw ApplicationException.invalidParameter(
        'token',
        'Token decoding failed',
      ).previousError(error as Error);
    }
  }
}
