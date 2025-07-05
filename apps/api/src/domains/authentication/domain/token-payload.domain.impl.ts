import { ApplicationException } from '@/shared';

import { TokenPayload } from '../interfaces';

export class TokenPayloadImpl implements TokenPayload {
  constructor(
    private readonly subject: string,
    private readonly username: string,
    private readonly issuedAt: number = -1,
    private readonly type: string = 'access_token',
  ) {
    this.validate();
  }

  getSubject(): string {
    return this.subject;
  }

  getUsername(): string {
    return this.username;
  }

  getIssuedAt(): number {
    return this.issuedAt;
  }

  getType(): string {
    return this.type;
  }

  toJSON(): object {
    return {
      sub: this.subject,
      username: this.username,
      iat: this.issuedAt,
      type: this.type,
    };
  }

  private validate(): void {
    const exceptions = [];

    if (!this.subject) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'subject',
          'Subject (user ID) is required',
        ),
      );
    }

    if (!this.username) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'username',
          'Username is required',
        ),
      );
    }

    if (this.issuedAt <= 0) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'issuedAt',
          'Issued at timestamp must be a positive number',
        ),
      );
    }

    if (!this.type) {
      exceptions.push(
        ApplicationException.invalidParameter('type', 'Token type is required'),
      );
    }
    if (exceptions.length > 0) {
      throw ApplicationException.invalidParameter(
        'tokenPayload',
        'Invalid token payload data',
      )
        .exceptions(exceptions)
        .withExceptionCode('TOKEN_PAYLOAD_VALIDATION_ERROR');
    }
  }
}
