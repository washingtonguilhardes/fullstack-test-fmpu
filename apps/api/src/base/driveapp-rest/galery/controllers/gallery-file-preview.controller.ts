import { Controller, Get, Param } from '@nestjs/common';

@Controller('/gallery/output')
export class DriveappGalleryFilePreviewController {
  // constructor(private readonly getMediaByGuidUseCase: GetMediaByGuidUsecase) {}

  @Get('*')
  async getMediaByGuid(@Param() params: string[]) {
    // return this.getMediaByGuidUseCase.execute(guid);
    console.log(params);
    return {
      message: 'File preview',
      params,
    };
  }
}
