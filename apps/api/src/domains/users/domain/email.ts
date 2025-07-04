import { ApplicationException } from '@/shared/exceptions/application.exception';

export interface Email {
  getValue(): string;
  validate(): boolean;
  toString(): string;
}

export class EmailImpl implements Email {
  constructor(private readonly email: string) {
    this.validate();
  }

  toString(): string {
    return this.email;
  }

  validate(): boolean {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!isValid) {
      throw ApplicationException.invalidParameter(
        'email',
        'Valid email is required following the format: example@example.com',
      );
    }
    return isValid;
  }

  getValue(): string {
    return this.email;
  }
}
