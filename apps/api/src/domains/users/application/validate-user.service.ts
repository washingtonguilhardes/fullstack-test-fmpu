import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { ApplicationException } from '@/shared/exceptions';

import { Email, Password, User } from '../domain';

export interface IValidateUserService {
  execute(user: User): Promise<void>;
}

export class ValidateUserServiceImpl implements IValidateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user: User): Promise<void> {
    if (!user.getEmail() || !user.getPassword()) {
      throw ApplicationException.invalidParameter(
        'email|password',
        'Email and password is required',
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
    const existing = await this.userRepository.findByEmail(
      user.getEmail().getValue(),
    );
    if (existing) {
      throw ApplicationException.invalidParameter(
        'email',
        'Invalid user data, please check your email and password',
      );
    }
  }
}
