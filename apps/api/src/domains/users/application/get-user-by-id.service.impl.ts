import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { EmailImpl, HashedPasswordImpl, User, UserImpl } from '../domain';
import type { GetUserByIdService } from '../interfaces';

export class GetUserByIdServiceImpl implements GetUserByIdService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User | null> {
    const userData = await this.userRepository.findById(id);
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
