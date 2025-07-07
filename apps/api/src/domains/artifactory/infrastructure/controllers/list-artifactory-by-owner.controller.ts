import { ArtifactoryType } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import {
  DecodeTokenService,
  DecodeTokenServiceRef,
} from '@/domains/authentication';
import { AccessToken } from '@/domains/authentication/infrastructure';
import { Controller, Inject, Query, Get } from '@nestjs/common';

import {
  ListArtifactoryByOwnerService,
  ListArtifactoryByOwnerServiceRef,
} from '../../interfaces';

@Controller('/files')
export class ListArtifactoryByOwnerController {
  constructor(
    @Inject(ListArtifactoryByOwnerServiceRef)
    private readonly listArtifactoryByOwnerService: ListArtifactoryByOwnerService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  @Get()
  async listArtifactoryByOwner(
    @AccessToken() accessToken: string,
    @Query('parentId') parentId?: string,
    @Query('artifactoryName') artifactoryName?: string,
    @Query('includeAll') includeAll?: boolean,
    @Query('type') type?: ArtifactoryType,
  ) {
    const tokenPayload = await this.decodeTokenService.execute(accessToken);
    const ownerId = tokenPayload.getSubject();

    return await this.listArtifactoryByOwnerService.execute({
      ownerId,
      pathId: parentId,
      artifactoryName,
      includeAll,
      type,
    });
  }
}
