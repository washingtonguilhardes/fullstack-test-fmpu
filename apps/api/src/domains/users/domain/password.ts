import * as bcrypt from 'bcrypt';

import { ApplicationException } from '@/shared/exceptions';

import { HashedPassword, HashedPasswordImpl } from './hashed-password';

export interface Password {
  getValue(): string;
  hash(): Promise<HashedPassword>;
  validate(): void;
  isEqualTo(password: HashedPassword): Promise<boolean>;
  toJSON(): string;
}

const SALT_ROUNDS = 10;

export class PasswordImpl implements Password {
  constructor(private readonly rawPassword: string) {
    this.validate();
  }

  getValue(): string {
    return this.rawPassword;
  }

  async hash(): Promise<HashedPassword> {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(this.rawPassword, salt);
      return new HashedPasswordImpl(hashedPassword);
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

  async isEqualTo(password: HashedPassword): Promise<boolean> {
    if (!this.rawPassword) {
      return false;
    }
    try {
      const result = await bcrypt.compare(
        this.rawPassword,
        password.getValue(),
      );
      return result;
    } catch (error) {
      console.log('error', error);
      throw ApplicationException.invalidParameter(
        'password',
        'Error comparing passwords',
      ).previousError(error as Error);
    }
  }
}
