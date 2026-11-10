import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PitruService } from './pitru.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('pitru-records')
@UseGuards(JwtAuthGuard)
export class PitruController {
  constructor(private readonly pitruService: PitruService) {}

  @Get()
  getMyPitruRecords(@CurrentUser() user: any) {
    return this.pitruService.getMyPitruRecords(user.userId);
  }

  @Post()
  createPitruRecord(@CurrentUser() user: any, @Body() body: any) {
    return this.pitruService.createPitruRecord(user.userId, body);
  }

  @Put(':id')
  updatePitruRecord(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.pitruService.updatePitruRecord(user.userId, id, body);
  }

  @Delete(':id')
  deletePitruRecord(@CurrentUser() user: any, @Param('id') id: string) {
    return this.pitruService.deletePitruRecord(user.userId, id);
  }
}
