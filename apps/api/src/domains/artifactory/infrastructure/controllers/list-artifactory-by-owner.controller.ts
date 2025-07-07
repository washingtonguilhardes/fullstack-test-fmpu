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

@Controller('/artifactory/list-by-owner')
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
    @Query('pathId') pathId?: string,
    @Query('artifactoryName') artifactoryName?: string,
  ) {
    const tokenPayload = await this.decodeTokenService.execute(accessToken);
    const ownerId = tokenPayload.getSubject();

    return await this.listArtifactoryByOwnerService.execute({
      ownerId,
      pathId,
      artifactoryName,
    });
  }
}
