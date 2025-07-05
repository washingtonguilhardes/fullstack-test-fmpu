import * as jwt from 'jsonwebtoken';

import { ApplicationException } from '@/shared';

import { TokenPayloadImpl } from '../domain';
import { DecodeTokenService, TokenPayload } from '../interfaces';

export class DecodeTokenServiceImpl implements DecodeTokenService {
  constructor(private readonly jwtSecret: string) {
    if (!this.jwtSecret) {
      throw ApplicationException.parameterNotFound(
        'token decode secret',
        'Invalid server configuration',
      );
    }
  }

  async execute(token: string): Promise<TokenPayload> {
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

      return new TokenPayloadImpl(decoded.sub, decoded.username, decoded.iat);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApplicationException.invalidParameter(
          'token',
          'JWT token decoding failed',
        ).previousError(error as Error);
      }

      if (error instanceof ApplicationException) {
        throw error;
      }

      throw ApplicationException.invalidParameter(
        'token',
        'Token decoding failed',
      ).previousError(error as Error);
    }
  }
}
