import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { ApplicationException } from '@/shared/exceptions';

import { Password, User } from '../domain';
import { ICreateUserService } from '../interfaces/services/create-user';
import { IValidateUserService } from './validate-user.service';

export class CreateUserServiceImpl implements ICreateUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validateUserService: IValidateUserService,
  ) {}

  async execute(user: User): Promise<User> {
    await this.validateUserService.execute(user);

    let passwordHash: string;

    try {
      passwordHash = await user.getPassword().hash();
    } catch (error) {
      throw ApplicationException.invalidParameter(
        'password',
        'Unable to process password',
      ).previousError(error as Error);
    }

    const { _id } = await this.userRepository.create({
      email: user.getEmail().getValue(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      passwordHash,
      createdAt: new Date(),
    });
    user.setId(_id);
    return user;
  }
}
