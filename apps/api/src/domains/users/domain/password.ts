import * as bcrypt from 'bcrypt';

import { ApplicationException } from '@/shared/exceptions';

export interface Password {
  hash(): Promise<string>;
  validate(): void;
}

const SALT_ROUNDS = 10;

export class PasswordImpl implements Password {
  constructor(private readonly rawPassword: string) {
    this.validate();
  }

  async hash(): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      return await bcrypt.hash(this.rawPassword, salt);
    } catch (error) {
      throw ApplicationException.invalidParameter(
        'password',
        'Error hashing password',
      ).previousError(error as Error);
    }
  }

  toJSON() {
    return '********';
  }

  toString() {
    return '********';
  }

  validate() {
    if (!this.rawPassword) {
      throw ApplicationException.invalidParameter(
        'password',
        'Password is required',
      );
    }

    const isValid =
      this.rawPassword.length >= 8 &&
      this.rawPassword.length <= 20 &&
      /[A-Z]/.test(this.rawPassword) &&
      /[a-z]/.test(this.rawPassword) &&
      /[0-9]/.test(this.rawPassword);

    if (!isValid) {
      throw ApplicationException.invalidParameter(
        'password',
        'Password must be at least 8 characters long and at most 20 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }
  }
}
