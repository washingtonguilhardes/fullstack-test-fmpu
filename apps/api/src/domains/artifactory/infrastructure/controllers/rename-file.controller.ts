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
import { Body, Controller, Inject, Param, Put } from '@nestjs/common';

import {
  RenameArtifactoryService,
  RenameArtifactoryServiceRef,
} from '../../interfaces/rename-artifactory.service';

interface RenameArtifactoryDto {
  newName: string;
}

@Controller('/files/:id/rename')
export class RenameFileController {
  constructor(
    @Inject(RenameArtifactoryServiceRef)
    private readonly renameArtifactoryService: RenameArtifactoryService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
    @Inject(GetUserByIdServiceRef)
    private readonly getUserByIdService: GetUserByIdService,
  ) {}

  @Put()
  async renameFile(
    @Param('id') artifactoryId: string,
    @Body() body: RenameArtifactoryDto,
    @AccessToken() accessToken: string,
  ): Promise<{ message: string }> {
    try {
      const tokenPayload = await this.decodeTokenService.execute(accessToken);
      const user = await this.getUserByIdService.execute(
        tokenPayload.getSubject(),
      );

      if (!user) {
        throw ApplicationException.objectNotFound('User not found');
      }

      if (!body.newName) {
        throw ApplicationException.invalidParameter(
          'newName',
          'New name is required',
        );
      }

      await this.renameArtifactoryService.execute(
        artifactoryId,
        body.newName,
        user.getId(),
      );

      return {
        message: 'Artifactory item renamed successfully',
      };
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw ApplicationException.internalExecutionError(
        'Rename artifactory',
        'Failed to rename artifactory item',
      );
    }
  }
}
