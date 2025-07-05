import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { ApplicationException } from '@/shared/exceptions';

import { Email, Password, User, UserImpl } from '../domain';
import { ICreateUserService } from '../interfaces/services/create-user.service';
import { IValidateUserService } from './validate-user.service';

export class CreateUserServiceImpl implements ICreateUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validateUserService: IValidateUserService,
  ) {}

  async execute(
    email: Email,
    password: Password,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    try {
      const hashedPassword = await password.hash();
      const user = new UserImpl(
        email,
        hashedPassword,
        firstName,
        lastName,
        new Date(),
        null,
      );

      await this.validateUserService.execute(user);

      const { _id } = await this.userRepository.create({
        email: user.getEmail().getValue(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        passwordHash: user.getPassword().getValue(),
        createdAt: new Date(),
      });
      user.setId(_id);
      return user;
    } catch (error) {
      console.log(error);
      throw ApplicationException.invalidParameter(
        'password',
        'Unable to create user, please try again',
      ).previousError(error as Error);
    }
  }
}
