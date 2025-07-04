import { Email, Password, User } from '../../domain';

export interface ICreateUserService {
  execute(
    email: Email,
    password: Password,
    firstName: string,
    lastName: string,
  ): Promise<User>;
}
export const CreateUserServiceRef = Symbol('CreateUserService');
