import path from 'path';

import { AddNewMediaUsecase } from '@driveapp/contracts/usecases';
import { InjectBucket } from '@driveapp/core/modules';

import {
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/gallery/upload')
export class DriveappGalleryUploadController {
  constructor(private readonly addNewMediaUseCase: AddNewMediaUsecase) {}

  private replaceSpecialChars(str: string) {
    const specialChars = {
      Á: 'A',
      ã: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      â: 'a',
      ê: 'e',
      î: 'i',
      ô: 'o',
      û: 'u',
      à: 'a',
      è: 'e',
      ì: 'i',
      ò: 'o',
      ù: 'u',
      Ç: 'C',
      ç: 'c',
    };

    return str.replace(/[^a-zA-Z0-9\s]/g, function (match) {
      return specialChars[match] || '_';
    });
  }

  private sanitizeFileName(name: string): string {
    const extName = path.extname(name);
    const basename = this.replaceSpecialChars(
      path.basename(name.toLowerCase(), extName),
    ).replace(/ /g, '_');

    return `${basename}${extName}`.toLowerCase();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(201)
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    const result = await this.addNewMediaUseCase.execute(
      files.map((file) => ({
        ...file,
        originalname: this.sanitizeFileName(file.originalname),
      })),
    );

    return {
      message: 'Files uploaded successfully',
      result,
    };
  }
}
