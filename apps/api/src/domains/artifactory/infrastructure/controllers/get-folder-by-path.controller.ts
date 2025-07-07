import {
  DecodeTokenServiceRef,
  DecodeTokenService,
} from '@/domains/authentication';
import { AccessToken } from '@/domains/authentication/infrastructure/nest/decorators/access-token.decorator';
import { Controller, Get, Inject, Query } from '@nestjs/common';

import {
  GetFolderByPathService,
  GetFolderByPathServiceRef,
} from '../../interfaces/get-folder-by-path.service';

@Controller('/artifactory/folder')
export class GetFolderByPathController {
  constructor(
    @Inject(GetFolderByPathServiceRef)
    private readonly getFolderByPathService: GetFolderByPathService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  @Get()
  async getFolderByPath(
    @Query('path') path: string,
    @AccessToken() accessToken: string,
  ) {
    const tokenPayload = await this.decodeTokenService.execute(accessToken);
    return this.getFolderByPathService.execute(path, tokenPayload.getSubject());
  }
}
