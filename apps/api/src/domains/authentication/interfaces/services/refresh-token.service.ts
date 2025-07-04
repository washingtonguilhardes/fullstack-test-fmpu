import { User } from '@/domains/users';

export interface IRefreshTokenService {
  execute(token: string, user: User): Promise<string>;
}
