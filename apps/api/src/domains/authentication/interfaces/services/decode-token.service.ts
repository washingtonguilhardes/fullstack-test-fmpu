import { Token, TokenPayload } from '../domains';

export interface DecodeTokenService {
  execute(token: string): Promise<TokenPayload>;
}

export const DecodeTokenServiceRef = Symbol('DecodeTokenServiceRef');
