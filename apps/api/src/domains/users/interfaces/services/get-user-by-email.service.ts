import { Email, User } from '@/domains/users/domain';

export interface GetUserByEmailService {
  execute(email: Email): Promise<User | null>;
}
export const GetUserByEmailServiceRef = Symbol('GetUserByEmailService');
