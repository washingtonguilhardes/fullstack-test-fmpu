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
import { Body, Controller, Inject, Post } from '@nestjs/common';

import {
  MoveArtifactoryService,
  MoveArtifactoryServiceRef,
} from '../../interfaces/move-artifactory.service';

interface MoveArtifactoryDto {
  artifactoryId: string;
  targetFolderId: string;
}

@Controller('/files/:id/move')
export class MoveArtifactoryController {
  constructor(
    @Inject(MoveArtifactoryServiceRef)
    private readonly moveArtifactoryService: MoveArtifactoryService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
    @Inject(GetUserByIdServiceRef)
    private readonly getUserByIdService: GetUserByIdService,
  ) {}

  @Post()
  async moveArtifactory(
    @Body() body: MoveArtifactoryDto,
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

      if (!body.artifactoryId) {
        throw ApplicationException.invalidParameter(
          'artifactoryId',
          'Artifactory ID is required',
        );
      }

      if (!body.targetFolderId) {
        throw ApplicationException.invalidParameter(
          'targetFolderId',
          'Target folder ID is required',
        );
      }

      await this.moveArtifactoryService.execute(
        body.artifactoryId,
        body.targetFolderId,
        user.getId(),
      );

      return {
        message: 'Artifactory item moved successfully',
      };
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw error;
      }
      throw ApplicationException.internalExecutionError(
        'Move artifactory',
        'Failed to move artifactory item',
      );
    }
  }
}
