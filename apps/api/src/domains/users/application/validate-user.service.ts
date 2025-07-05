import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { ApplicationException } from '@/shared/exceptions';

import { Email, Password, User } from '../domain';
import { GetUserByEmailService } from '../interfaces';

export interface IValidateUserService {
  execute(user: User): Promise<void>;
}

export const ValidateUserServiceRef = Symbol('ValidateUserService');

export class ValidateUserServiceImpl implements IValidateUserService {
  constructor(private readonly getUserByEmailService: GetUserByEmailService) {}

  async execute(user: User): Promise<void> {
    if (!user.getEmail() || !user.getPassword()) {
      throw ApplicationException.invalidParameter(
        'user',
        'User data mismatch that was provided',
      );
    }

    try {
      user.getEmail().validate();
    } catch (error) {
      throw ApplicationException.invalidParameter(
        'email',
        'Invalid email',
      ).previousError(error as Error);
    }

    try {
      user.getPassword().validate();
    } catch (error) {
      throw ApplicationException.invalidParameter(
        'password',
        'Invalid password',
      ).previousError(error as Error);
    }
    const existing = await this.getUserByEmailService.execute(user.getEmail());
    if (existing && existing.getId().toString() !== user.getId().toString()) {
      throw ApplicationException.invalidParameter('email', 'Invalid user data');
    }
  }
}
