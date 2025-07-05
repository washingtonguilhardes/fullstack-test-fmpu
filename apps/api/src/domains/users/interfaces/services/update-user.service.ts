import { UserProfileEntity } from '@driveapp/contracts/entities/users/user.entity';

import { Email } from '../../domain';

export interface UpdateUserService {
  execute(
    id: string,
    email?: Email,
    firstName?: string,
    lastName?: string,
  ): Promise<void>;
}

export const UpdateUserServiceRef = Symbol('UpdateUserService');
