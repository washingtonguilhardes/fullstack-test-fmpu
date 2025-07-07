import { Multer } from 'multer';

import { CreateNewFileDto } from '@driveapp/contracts/entities/artifactory/artifactory.entity';

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
import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { StoreFileUsecase, StoreFileUsecaseRef } from '../../interfaces';

@Controller('/artifactory/upload')
export class UploadController {
  constructor(
    @Inject(StoreFileUsecaseRef)
    private readonly storeFileUsecase: StoreFileUsecase,
    @Inject(DecodeTokenServiceRef)
    private readonly decodeTokenService: DecodeTokenService,
    @Inject(GetUserByIdServiceRef)
    private readonly getUserByIdService: GetUserByIdService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNewFileDto,
    @AccessToken() accessToken: string,
  ) {
    const tokenPayload = await this.decodeTokenService.execute(accessToken);
    const user = await this.getUserByIdService.execute(
      tokenPayload.getSubject(),
    );

    if (!user) {
      throw ApplicationException.objectNotFound('User not found');
    }

    return await this.storeFileUsecase.execute(user, {
      ...body,
      buffer: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
      name: file.originalname,
      parentId: body.parentId,
    });
  }
}
