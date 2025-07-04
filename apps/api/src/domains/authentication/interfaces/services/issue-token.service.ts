import { User } from '@/domains/users';

import { AuthenticationPayload } from '../domains';

export interface IssueTokenService {
  execute(payload: AuthenticationPayload): Promise<string>;
}

export const IssueTokenServiceRef = Symbol('IssueTokenService');
