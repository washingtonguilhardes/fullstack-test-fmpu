import * as jwt from 'jsonwebtoken';

import { ValidateUserByCredentialsService } from '@/domains/users/interfaces';
import { ApplicationException } from '@/shared';

import { TokenPayloadImpl } from '../domain';
import { AuthenticationPayload, IssueTokenService } from '../interfaces';

export class IssueTokenServiceImpl implements IssueTokenService {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
    private readonly validateUserByCredentialsService: ValidateUserByCredentialsService,
  ) {
    if (!this.jwtSecret) {
      throw ApplicationException.parameterNotFound(
        'token issue secret',
        'Invalid server configuration',
      );
    }
  }

  async execute(requestPayload: AuthenticationPayload): Promise<string> {
    requestPayload.validate();
    console.log('\n\nrequestPayload', requestPayload);

    try {
      const user = await this.validateUserByCredentialsService.execute(
        requestPayload.getEmail(),
        requestPayload.getPassword(),
      );

      const tokenPayload = new TokenPayloadImpl(
        user.getId(),
        user.getEmail().getValue(),
        Math.floor(Date.now() / 1000),
      );

      const token = jwt.sign(tokenPayload.toJSON(), this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
        issuer: 'driveapp-api',
        audience: 'driveapp-users',
      } as jwt.SignOptions);

      return token;
    } catch (error) {
      console.log('error', error);
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApplicationException.invalidParameter(
          'credentials',
          `JWT token generation failed: ${error.message}`,
        );
      }

      throw ApplicationException.invalidParameter(
        'credentials',
        `Unable to issue token, please check your credentials and try again`,
      ).previousError(error as Error);
    }
  }
}
