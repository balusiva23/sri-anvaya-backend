import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  getFamily(@CurrentUser() user: any) {
    return this.familiesService.getFamily(user.userId);
  }

  @Put()
  updateFamily(@CurrentUser() user: any, @Body() body: any) {
    return this.familiesService.updateFamily(user.userId, body);
  }

  @Post('members')
  addMember(@CurrentUser() user: any, @Body() body: any) {
    return this.familiesService.addMember(user.userId, body);
  }

  @Delete('members/:id')
  removeMember(@CurrentUser() user: any, @Param('id') id: string) {
    return this.familiesService.removeMember(user.userId, id);
  }
}
