import { ApplicationException } from '@/shared/exceptions';

export interface HashedPassword {
  getValue(): string;
  toJSON(): string;
  validate(): void;
}
export class HashedPasswordImpl implements HashedPassword {
  constructor(private readonly hashedPassword: string) {
    this.validate();
  }

  toJSON(): string {
    return '************';
  }

  validate(): void {
    if (!this.hashedPassword) {
      throw ApplicationException.invalidParameter(
        'password',
        'Hashed password is required',
      );
    }
  }

  getValue(): string {
    return this.hashedPassword;
  }
}
