import { Email, Password } from '@/domains/users';

export interface AuthenticationPayload {
  getEmail(): Email;
  getPassword(): Password;
  validate(): void;
}
