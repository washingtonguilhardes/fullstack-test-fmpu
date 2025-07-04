import { Password, User } from '../../domain';

export interface ICreateUserService {
  execute(user: User): Promise<User>;
}
export const CreateUserService = Symbol('CreateUserService');
