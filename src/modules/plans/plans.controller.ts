import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  getAllPlans() {
    return this.plansService.getAllPlans();
  }

  @Get('active')
  getActivePlans() {
    return this.plansService.getActivePlans();
  }

  @Get(':id')
  getPlanById(@Param('id') id: string) {
    return this.plansService.getPlanById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  createPlan(@Body() body: any) {
    return this.plansService.createPlan(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updatePlan(@Param('id') id: string, @Body() body: any) {
    return this.plansService.updatePlan(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  deletePlan(@Param('id') id: string) {
    return this.plansService.deletePlan(id);
  }
}
