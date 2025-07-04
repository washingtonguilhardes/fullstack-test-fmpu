import { User } from '@/domains/users';

export interface IValidateTokenService {
  execute(token: string): Promise<void>;
}
