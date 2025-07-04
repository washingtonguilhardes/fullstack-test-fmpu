import { UserEntity } from '@driveapp/contracts/entities/users/user.entity';

import { ApplicationException } from '@/shared/exceptions/application.exception';

import { Email } from './email';
import { Password } from './password';

export interface User {
  setId(id: string): void;
  getId(): string;
  getEmail(): Email;
  getFirstName(): string;
  getLastName(): string;
  getFullName(): string;
  getUsername(): string;
  getPassword(): Password | null;
}

export class UserImpl implements User {
  private id: string | null = null;

  constructor(
    private readonly email: Email,
    private readonly password: Password | null,
    private readonly firstName: string = '',
    private readonly lastName: string = '',
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date | null = null,
  ) {
    this.validate();
  }

  setId(id: string): void {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  getPassword(): Password | null {
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

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getUsername(): string {
    return this.email.getValue();
  }

  toJSON() {
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
    if (!this.firstName) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'firstName',
          'First name is required',
        ),
      );
    }
    if (!this.lastName) {
      exceptions.push(
        ApplicationException.invalidParameter(
          'lastName',
          'Last name is required',
        ),
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
}
