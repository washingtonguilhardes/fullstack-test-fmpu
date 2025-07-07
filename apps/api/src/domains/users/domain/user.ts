import {
  UserEntity,
  UserProfileEntity,
} from '@driveapp/contracts/entities/users/user.entity';

import { ApplicationException } from '@/shared/exceptions/application.exception';

import { Email } from './email';
import { HashedPassword } from './hashed-password';
import { Password } from './password';

export interface User {
  setId(id: string): void;
  getId(): string;
  getEmail(): Email;
  setEmail(email: Email): void;
  getFirstName(): string;
  setFirstName(firstName: string): void;
  getLastName(): string;
  setLastName(lastName: string): void;
  getUsername(): string;
  getPassword(): HashedPassword | null;
  setUpdatedAt(updatedAt: Date): void;
  getUpdatedAt(): Date | null;
  toEntity(): UserEntity;
}

export class UserImpl implements User {
  private id: string | null = null;

  private email: Email;

  private password: HashedPassword;

  private firstName: string;

  private lastName: string;

  private createdAt: Date;

  private updatedAt: Date | null;

  constructor(
    email: Email,
    password: HashedPassword,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.validate();
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  setEmail(email: Email): void {
    this.email = email;
  }

  setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  setLastName(lastName: string): void {
    this.lastName = lastName;
  }

  setId(id: string): void {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  getPassword(): HashedPassword {
    return this.password;
  }

  getEmail(): Email {
    return this.email;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getUsername(): string {
    return this.email.getValue();
  }

  toJSON(): UserProfileEntity {
    return {
      id: this.id,
      email: this.email.getValue(),
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  validate(): void {
    if (!this.email || !this.password) {
      throw ApplicationException.invalidParameter(
        'email|password',
        'Email and password is required',
      );
    }
    const exceptions = [];

    try {
      this.email.validate();
    } catch (error) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'email',
          'Invalid email',
        ).previousError(error as Error),
      );
    }
    try {
      this.password.validate();
    } catch (error) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'password',
          'Invalid password',
        ).previousError(error as Error),
      );
    }

    if (exceptions.length > 0) {
      throw ApplicationException.invalidParameter(
        'userInput',
        'Invalid user data, please check your parameters',
      )
        .exceptions(exceptions)
        .withExceptionCode('USER_INPUT_ERROR');
    }
  }

  toEntity(): UserEntity {
    return {
      _id: this.id,
      email: this.email.getValue(),
      firstName: this.firstName,
      lastName: this.lastName,
      passwordHash: this.password.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
