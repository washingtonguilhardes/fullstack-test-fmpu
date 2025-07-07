import {
  AccessToken,
  DecodeTokenService,
  DecodeTokenServiceRef,
} from '@/domains/authentication';
import {
  GetUserByIdService,
  GetUserByIdServiceRef,
} from '@/domains/users/interfaces';
import { ApplicationException } from '@/shared';
import { Controller, Delete, Inject, Param } from '@nestjs/common';

import {
  DeleteFolderByIdService,
  DeleteFolderByIdServiceRef,
} from '../../interfaces';

@Controller('/folders/:id')
export class DeleteFolderController {
  constructor(
    @Inject(DeleteFolderByIdServiceRef)
    private readonly deleteFolderByIdService: DeleteFolderByIdService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
    @Inject(GetUserByIdServiceRef)
    private readonly getUserByIdService: GetUserByIdService,
  ) {}

  @Delete('remove')
  async deleteFile(
    @Param('id') fileId: string,
    @AccessToken() accessToken: string,
  ) {
    const tokenPayload = await this.decodeTokenService.execute(accessToken);
    const user = await this.getUserByIdService.execute(
      tokenPayload.getSubject(),
    );

    if (!user) {
      throw ApplicationException.objectNotFound('User not found');
    }

    await this.deleteFolderByIdService.execute(fileId, user.getId());

    return { message: 'Folder deleted successfully' };
  }
}
