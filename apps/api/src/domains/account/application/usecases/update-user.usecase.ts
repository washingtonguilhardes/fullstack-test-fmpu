import { UserProfileEntity } from '@driveapp/contracts/entities/users/user.entity';

import { TokenPayload } from '@/domains/authentication/interfaces';
import { EmailImpl } from '@/domains/users';
import { Resource, ResourceImpl } from '@/shared/security/domain/resource';
import { OwnershipValidationService } from '@/shared/security/interfaces/ownership-validation.service';

import { UpdateUserService } from '../../../users/interfaces';

export interface UpdateUserUseCase {
  execute(
    tokenPayload: TokenPayload,
    data: Partial<UserProfileEntity>,
  ): Promise<void>;
}

export const UpdateUserUseCaseRef = Symbol('UpdateUserUseCase');

export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  constructor(
    private readonly ownershipValidationService: OwnershipValidationService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  async execute(tokenPayload: TokenPayload, data: Partial<UserProfileEntity>) {
    const targetResource = new ResourceImpl([data.id!]);
    await this.ownershipValidationService.execute(
      targetResource,
      tokenPayload.getSubject(),
    );

    await this.updateUserService.execute(
      data.id!,
      data.email ? new EmailImpl(data.email) : undefined,
      data.firstName,
      data.lastName,
    );
  }
}
