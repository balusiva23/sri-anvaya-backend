import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.customersService.getProfile(user.userId);
  }

  @Put('profile')
  updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.customersService.updateProfile(user.userId, body);
  }

  @Put('onboarding')
  updateOnboarding(@CurrentUser() user: any, @Body() body: { step: number; payload: any }) {
    return this.customersService.updateOnboarding(user.userId, body);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS, UserRole.CUSTOMER_SUPPORT)
  getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS, UserRole.CUSTOMER_SUPPORT)
  getCustomerById(@Param('id') id: string) {
    return this.customersService.getCustomerById(id);
  }
}
