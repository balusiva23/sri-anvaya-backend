import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get('signed-url')
  getSignedUrl(@Query('folder') folder?: string) {
    return this.uploadsService.getSignedUploadUrl(folder);
  }

  @Delete(':publicId')
  deleteFile(@Param('publicId') publicId: string) {
    return this.uploadsService.deleteFile(publicId);
  }
}
