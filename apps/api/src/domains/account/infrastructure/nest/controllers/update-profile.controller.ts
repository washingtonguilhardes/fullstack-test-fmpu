import { UpdateUserDto } from '@driveapp/contracts/entities/users/user.entity';

import {
  UpdateUserUseCaseRef,
  UpdateUserUseCase,
} from '@/domains/account/application/usecases/update-user.usecase';
import { AccessToken } from '@/domains/authentication/infrastructure/nest/decorators/access-token.decorator';
import {
  DecodeTokenServiceRef,
  DecodeTokenService,
} from '@/domains/authentication/interfaces';
import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';

@Controller('/account/profile/:id')
export class UpdateProfileController {
  constructor(
    @Inject(UpdateUserUseCaseRef)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  @Patch()
  async updateProfile(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @AccessToken() accessToken: string,
  ) {
    const payload = await this.decodeTokenService.execute(accessToken);
    await this.updateUserUseCase.execute(payload, {
      id,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
    });
    return { message: 'Profile updated successfully' };
  }
}
