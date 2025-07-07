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
  DeleteFileByIdService,
  DeleteFileByIdServiceRef,
} from '../../interfaces/delete-file-by-id.service';

@Controller('/artifactory/files')
export class DeleteFileController {
  constructor(
    @Inject(DeleteFileByIdServiceRef)
    private readonly deleteFileByIdService: DeleteFileByIdService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
    @Inject(GetUserByIdServiceRef)
    private readonly getUserByIdService: GetUserByIdService,
  ) {}

  @Delete(':id')
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

    await this.deleteFileByIdService.execute(fileId, user.getId());

    return { message: 'File deleted successfully' };
  }
}
