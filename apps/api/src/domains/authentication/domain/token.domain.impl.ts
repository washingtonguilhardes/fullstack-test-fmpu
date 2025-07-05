import { Token } from '../interfaces';

export class TokenImpl implements Token {
  constructor(private readonly token: string) {}

  toJSON() {
    return this.token;
  }

  getValue(): string {
    return this.token;
  }
}
