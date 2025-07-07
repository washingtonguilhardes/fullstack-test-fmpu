import { AuthenticationModule } from '@/domains/authentication/infrastructure/nest/authentication.module';
import {
  IssueTokenService,
  IssueTokenServiceRef,
} from '@/domains/authentication/interfaces';
import { UserModule } from '@/domains/users';
import {
  UpdateUserService,
  UpdateUserServiceRef,
} from '@/domains/users/interfaces';
import {
  CreateUserServiceRef,
  ICreateUserService,
} from '@/domains/users/interfaces/services/create-user.service';
import { SecurityModule } from '@/shared';
import {
  OwnershipValidationService,
  OwnershipValidationServiceRef,
} from '@/shared/security/interfaces/ownership-validation.service';
import { Module } from '@nestjs/common';

import { SignupNewUserUsecase } from '../../application/usecases/signup-new-user.usecase';
import {
  UpdateUserUseCaseRef,
  UpdateUserUseCaseImpl,
} from '../../application/usecases/update-user.usecase';
import { SignupNewAccountUsecaseRef } from '../../interfaces/signup-new-account.inteface';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { UpdateProfileController } from './controllers/update-profile.controller';
import { WhoAmIController } from './controllers/whoami.controller';

@Module({
  controllers: [
    RegisterController,
    LoginController,
    WhoAmIController,
    UpdateProfileController,
  ],
  imports: [UserModule, AuthenticationModule, SecurityModule],
  providers: [
    {
      provide: UpdateUserUseCaseRef,
      useFactory: (
        ownershipValidationService: OwnershipValidationService,
        updateUserService: UpdateUserService,
      ) =>
        new UpdateUserUseCaseImpl(
          ownershipValidationService,
          updateUserService,
        ),
      inject: [OwnershipValidationServiceRef, UpdateUserServiceRef],
    },
    {
      provide: SignupNewAccountUsecaseRef,
      useFactory: (
        createUserService: ICreateUserService,
        issueTokenService: IssueTokenService,
      ) => new SignupNewUserUsecase(createUserService, issueTokenService),
      inject: [CreateUserServiceRef, IssueTokenServiceRef],
    },
  ],
  exports: [SignupNewAccountUsecaseRef],
})
export class AccountModule {}
