import { User } from '@/domains/users/domain';

export interface GetUserByIdService {
  execute(id: string): Promise<User | null>;
}
export const GetUserByIdServiceRef = Symbol('GetUserByIdService');
