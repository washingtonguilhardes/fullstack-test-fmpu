import { Email, Password, User } from '@/domains/users';

export interface ValidateUserByCredentialsService {
  execute(email: Email, password: Password): Promise<User | null>;
}
export const ValidateUserByCredentialsServiceRef = Symbol(
  'ValidateUserByCredentialsService',
);
