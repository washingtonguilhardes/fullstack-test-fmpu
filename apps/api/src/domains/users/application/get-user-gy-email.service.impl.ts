import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import {
  Email,
  EmailImpl,
  HashedPasswordImpl,
  PasswordImpl,
  User,
  UserImpl,
} from '../domain';
import type { GetUserByEmailService } from '../interfaces';

export class GetUserByEmailServiceImpl implements GetUserByEmailService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: Email): Promise<User | null> {
    email.validate();
    const userData = await this.userRepository.findByEmail(email.getValue());
    if (!userData) {
      return null;
    }
    const user = new UserImpl(
      new EmailImpl(userData.email),
      new HashedPasswordImpl(userData.passwordHash),
      userData.firstName,
      userData.lastName,
      userData.createdAt,
      userData.updatedAt,
    );
    user.setId(userData._id);
    return user;
  }
}
