import { Email, Password, User } from '@/domains/users';

export interface ISignupNewAccountUsecase {
  execute(
    email: Email,
    password: Password,
    firstName: string,
    lastName: string,
  ): Promise<[User, string]>;
}
export const SignupNewAccountUsecaseRef = Symbol('SignupNewAccountUsecase');
