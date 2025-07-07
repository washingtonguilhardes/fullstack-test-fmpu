import {
  ArtifactoryType,
  CreateNewFolderDto,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

import {
  DecodeTokenService,
  DecodeTokenServiceRef,
} from '@/domains/authentication';
import { AccessToken } from '@/domains/authentication/infrastructure';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import { FolderImpl, Path, PathImpl } from '../../domain';
import {
  CreateNewFolderService,
  CreateNewFolderServiceRef,
} from '../../interfaces';
import { ListFoldersByPathServiceRef } from '../../interfaces/list-folders-by-path.service';

@Controller('/artifactory/new-folder')
export class NewFolderController {
  constructor(
    @Inject(CreateNewFolderServiceRef)
    private readonly createNewFolderService: CreateNewFolderService,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNewFolder(
    @Body() body: CreateNewFolderDto,
    @AccessToken() accessToken: string,
  ) {
    const tokenPayload = await this.decodeTokenService.execute(accessToken);

    return await this.createNewFolderService.execute({
      name: body.name,
      ownerId: tokenPayload.getSubject(),
      artifactoryCount: 0,
      parentId: body.parentId,
    });
  }
}
