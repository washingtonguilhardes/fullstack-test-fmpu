import {
  UserEntity,
  UserProfileEntity,
} from '@driveapp/contracts/entities/users/user.entity';
import { IUserRepository } from '@driveapp/contracts/repositories/user.repository';

import { ApplicationException } from '@/shared';

import { Email, EmailImpl } from '../domain';
import {
  GetUserByEmailService,
  GetUserByIdService,
  UpdateUserService,
} from '../interfaces';
import { IValidateUserService } from './validate-user.service';

export class UpdateUserServiceImpl implements UpdateUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly getUserByIdService: GetUserByIdService,
    private readonly validateUserService: IValidateUserService,
  ) {}

  async execute(
    id: string,
    email?: Email,
    firstName?: string,
    lastName?: string,
  ): Promise<void> {
    const user = await this.getUserByIdService.execute(id);
    if (!user) {
      throw ApplicationException.objectNotFound('User not found');
    }

    let hasChanges = false;
    if (email) {
      user.setEmail(email);
      hasChanges = true;
    }
    if (firstName && firstName !== user.getFirstName()) {
      user.setFirstName(firstName);
      hasChanges = true;
    }
    if (lastName && lastName !== user.getLastName()) {
      user.setLastName(lastName);
      hasChanges = true;
    }
    if (hasChanges) {
      await this.validateUserService.execute(user);
      user.setUpdatedAt(new Date());
      await this.userRepository.update(user.toEntity());
    }
  }
}
