import { error } from 'console';

import { Email, Password } from '@/domains/users';
import { ApplicationException } from '@/shared';

import { AuthenticationPayload } from '../interfaces';

export class AuthenticationPayloadImpl implements AuthenticationPayload {
  constructor(
    private readonly email: Email,
    private readonly password: Password,
  ) {
    this.validate();
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): Password {
    return this.password;
  }

  toJSON(): Record<string, any> {
    return {
      email: this.email,
      password: this.password,
    };
  }

  validate(): void {
    if (!this.email || !this.password) {
      throw ApplicationException.invalidParameter('email', 'Email is required');
    }
    const exceptions = [];
    try {
      this.email.validate();
    } catch (error) {
      exceptions.push(error);
    }
    try {
      this.password.validate();
    } catch {
      // here we want to mask the password, without exposing the raw password
      exceptions.push(
        ApplicationException.invalidParameter('password', 'Invalid password'),
      );
    }
    if (exceptions.length > 0) {
      throw ApplicationException.invalidParameter(
        'auth',
        'Invalid credentials',
      ).exceptions(exceptions);
    }
  }
}
